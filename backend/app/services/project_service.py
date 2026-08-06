from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate

def create_project(db: Session, project: ProjectCreate, user_id: int):
    db_project = Project(**project.model_dump(), created_by=user_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_projects(
    db: Session, 
    page: int = 1, 
    limit: int = 10, 
    search: str = None, 
    sort: str = "created_at", 
    order: str = "desc"
):
    query = db.query(Project)

    # Search Logic
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Project.title.ilike(search_filter),
                Project.description.ilike(search_filter),
                Project.technology_stack.ilike(search_filter)
            )
        )

    # Sorting Logic
    sort_column = getattr(Project, sort, Project.created_at)
    if order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    # Pagination Logic
    offset = (page - 1) * limit
    return query.offset(offset).limit(limit).all()

def get_project_by_id(db: Session, project_id: int):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project

def update_project(db: Session, project_id: int, project_data: ProjectUpdate, current_user):
    project = get_project_by_id(db, project_id)

    # Ownership & RBAC Check
    is_owner = project.created_by == current_user.id
    is_admin = getattr(current_user, "role", None) == "super_admin"

    if not (is_owner or is_admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this project")

    update_data = project_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)
    return project

def delete_project(db: Session, project_id: int, current_user):
    project = get_project_by_id(db, project_id)

    # Ownership & RBAC Check
    is_owner = project.created_by == current_user.id
    is_admin = getattr(current_user, "role", None) == "super_admin"

    if not (is_owner or is_admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this project")

    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}