from fastapi import HTTPException, status, UploadFile
from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.project import Project
from app.models.media import Media
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from .storage.local import save_upload_file, delete_upload_file, UploadCategory, IMAGE_TYPES

class ProjectService:

    @classmethod
    def create_project(cls, db: Session, request: ProjectCreate, user_id: int):
        # Create a new project without any image file
        new_project = Project(
            title=request.title,
            description=request.description,
            repository_url=request.repository_url,
            demo_url=request.demo_url,
            status=request.status or "active",
            technology_stack=request.technology_stack,
            created_by=user_id
        )
        db.add(new_project)
        db.commit()
        db.refresh(new_project)
        return ProjectResponse.from_orm_custom(new_project)

    @classmethod
    def get_projects(cls, db: Session, page: int = 1, limit: int = 10, search: Optional[str] = None, sort: Optional[str] = "created_at", order: Optional[str] = "desc"):
        query = db.query(Project)
        
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                (Project.title.ilike(search_filter)) |
                (Project.description.ilike(search_filter)) |
                (Project.technology_stack.ilike(search_filter))
            )

        sort_column = getattr(Project, sort, Project.created_at)
        if order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())

        offset = (page - 1) * limit
        projects = query.offset(offset).limit(limit).all()
        return [ProjectResponse.from_orm_custom(p) for p in projects]

    @classmethod
    def get_project_by_id(cls, db: Session, project_id: int):
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        return ProjectResponse.from_orm_custom(project)

    @classmethod
    def update_project(cls, db: Session, project_id: int, request: ProjectUpdate, current_user):
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

        if project.created_by != current_user.id and current_user.role != "super_admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this project")

        update_data = request.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(project, key, value)

        db.commit()
        db.refresh(project)
        return ProjectResponse.from_orm_custom(project)

    @classmethod
    def delete_project(cls, db: Session, project_id: int, current_user):
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

        if project.created_by != current_user.id and current_user.role != "super_admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this project")

def _is_super_admin(current_user) -> bool:
    for ur in current_user.userRole:
        if ur.Roles.name == "super_admin":
            return True
    return False

def update_project(db: Session, project_id: int, project_data: ProjectUpdate, current_user):
    project = get_project_by_id(db, project_id)

    # Ownership & RBAC Check
    is_owner = project.created_by == current_user.id
    is_admin = _is_super_admin(current_user)

        return ProjectResponse.from_orm_custom(project)

    @classmethod
    def get_cover(cls, project_id: int, db: Session):
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        if not project.thumbnail:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cover not found")
        return project.thumbnail

    @classmethod
    def remove_cover(cls, project_id: int, db: Session, current_user):
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

        if project.created_by != current_user.id and current_user.role != "super_admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this project")

    # Ownership & RBAC Check
    is_owner = project.created_by == current_user.id
    is_admin = _is_super_admin(current_user)

        return {"message": "Project cover deleted successfully"}

projectService = ProjectService()
projectCoverService = ProjectCoverService()