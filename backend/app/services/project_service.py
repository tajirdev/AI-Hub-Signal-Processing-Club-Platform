from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from app.models.project import Project
from app.models.media import Media
from app.schemas.project import ProjectCreate, ProjectUpdate
from .storage.local import save_upload_file, delete_upload_file, UploadCategory, IMAGE_TYPES

class ProjectService:
    @staticmethod
    def create_project(db: Session, request: ProjectCreate, file: UploadFile = None, user_id: int = None):
        thumbnail_id = None
        if file:
            upload = save_upload_file(
                file=file,
                allowed_types=IMAGE_TYPES,
                category=UploadCategory.PROJECT_THUMBNAILS
            )
            project_media = Media(
                filename=upload["filename"],
                path=upload["path"],
                original_filename=file.filename,
                mime_type=upload["mime_type"],
                uploaded_by=user_id
            )
            db.add(project_media)
            db.flush()
            thumbnail_id = project_media.id

        project = Project(
            title=request.title,
            description=request.description,
            repository_url=request.repository_url,
            demo_url=request.demo_url,
            status=request.status or "active",
            technology_stack=request.technology_stack,
            thumbnail_id=thumbnail_id,
            created_by=user_id
        )
        db.add(project)
        db.commit()
        db.refresh(project)
        return ProjectResponseMap(project)

    @staticmethod
    def get_projects(db: Session, page: int = 1, limit: int = 10, search: str = None, sort: str = "created_at", order: str = "desc"):
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
        return [ProjectResponseMap(p) for p in projects]

    @staticmethod
    def get_project_by_id(db: Session, project_id: int):
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        return ProjectResponseMap(project)

    @staticmethod
    def update_project(db: Session, project_id: int, request: ProjectUpdate, file: UploadFile = None, current_user = None):
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

        if project.created_by != current_user.id and getattr(current_user, "role", None) != "super_admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this project")

        if file:
            if project.thumbnail_id:
                media_file = db.query(Media).filter(Media.id == project.thumbnail_id).first()
                if media_file:
                    delete_upload_file(media_file.path)
                    upload = save_upload_file(
                        file=file,
                        allowed_types=IMAGE_TYPES,
                        category=UploadCategory.PROJECT_THUMBNAILS
                    )
                    media_file.filename = upload["filename"]
                    media_file.path = upload["path"]
                    media_file.original_filename = file.filename
                    media_file.mime_type = upload["mime_type"]
            else:
                upload = save_upload_file(
                    file=file,
                    allowed_types=IMAGE_TYPES,
                    category=UploadCategory.PROJECT_THUMBNAILS
                )
                new_media = Media(
                    filename=upload["filename"],
                    path=upload["path"],
                    original_filename=file.filename,
                    mime_type=upload["mime_type"],
                    uploaded_by=current_user.id
                )
                db.add(new_media)
                db.flush()
                project.thumbnail_id = new_media.id

        update_data = request.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(project, key, value)

        db.commit()
        db.refresh(project)
        return ProjectResponseMap(project)

    @staticmethod
    def delete_project(db: Session, project_id: int, current_user = None):
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

        if project.created_by != current_user.id and getattr(current_user, "role", None) != "super_admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this project")

        if project.thumbnail_id:
            media_file = db.query(Media).filter(Media.id == project.thumbnail_id).first()
            if media_file:
                delete_upload_file(media_file.path)
                project.thumbnail_id = None
                db.delete(media_file)

        db.delete(project)
        db.commit()
        return {"message": "Project deleted successfully"}

def ProjectResponseMap(project):
    return {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "repository_url": project.repository_url,
        "demo_url": project.demo_url,
        "status": project.status,
        "technology_stack": project.technology_stack,
        "thumbnail_id": project.thumbnail_id,
        "thumbnail": project.thumbnail.path if project.thumbnail else None,
        "created_by": project.created_by,
        "created_at": project.created_at,
        "updated_at": project.updated_at
    }