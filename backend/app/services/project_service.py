from fastapi import HTTPException, status, UploadFile,File
from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.project import Project
from app.models.media import Media
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from .storage.local import save_upload_file, delete_upload_file, UploadCategory, IMAGE_TYPES
import math

class ProjectService():

    @staticmethod
    def create_project(request:ProjectCreate,current_user,db:Session):
        # Create a new project without any image file
        new_project = Project(
            title=request.title,
            description=request.description,
            repository_url=str(request.repository_url),
            demo_url=str(request.demo_url),
            status=request.status or "active",
            technology_stack=request.technology_stack,
            created_by=current_user.id
        )
        db.add(new_project)
        db.commit()
        db.refresh(new_project)
        return new_project

    @staticmethod
    def get_projects(db: Session, page: int = 1, limit: int = 10, search: Optional[str] = None, sort: Optional[str] = "created_at", order: Optional[str] = "desc"):
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
        total=query.count()
        total_pages=math.ceil( total / limit)
        projects = query.offset(offset).limit(limit).all()
        return {
            "page":page,
            "total_projects":total,
            "limit":limit,
            "total_pages":total_pages,
            "projects":projects
        }

    @staticmethod
    def get_project_by_id(db: Session, project_id: int):
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        return project

    @staticmethod
    def update_project(db: Session, project_id: int, request: ProjectUpdate, current_user):
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

        if project.created_by != current_user.id and current_user.role != "super_admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this project")
        
        project.title=request.title,
        project.description=request.description,
        project.demo_url=request.demo_url,
        project.status=request.status,
        project.technology_stack=request.technology_stack
        
        db.commit()
        db.refresh(project)
        return  project

    @staticmethod
    def delete_project(db: Session, project_id: int, current_user):
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

        if project.created_by != current_user.id and current_user.role != "super_admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this project")
        
        db.delete(project)
        db.commit()
        return {
            "message":"project delete successful"
        }
    @staticmethod
    def project_cover(project_id:int,
                            db:Session,
                            path:str,
                            current_user:int,
                            original_filename:str,
                            mime_type:str,
                            filename:str):
        project=db.query(Project).filter(Project.id==project_id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="project not found")
        if (project.created_by != current_user.id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="you  cannot perform these action")
        cover=db.query(Media).filter(Media.id==project.thumbnail_id).first()
        if cover:
            cover.filename=filename
            delete_upload_file(cover.path)
            cover.path=path,
            cover.mime_type=mime_type,
            cover.original_filename
            
            db.commit()
            db.refresh(cover)
            
        else:
            
            cover=Media(
                filename=filename,
                original_filename=original_filename,
                mime_type=mime_type,
                path=path,
                uploaded_by=current_user.id
        )
        db.add(cover)
        db.flush()
        project.thumbnail_id=cover.id
        
        db.commit()
        db.refresh(cover)
        
        return cover
        
        
    @staticmethod
    def get_cover(project_id: int, db: Session):
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        cover=db.query(Media).filter(Media.id==project.thumbnail_id).first()
        if not cover:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cover not found")
        return project.thumbnail

    @staticmethod
    def remove_cover(project_id: int, db: Session, current_user):
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        
        if project.created_by != current_user.id and current_user.role != "super_admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this project")
        
        cover=db.query(Media).filter(Media.id==project.thumbnail_id).first()
        if not cover:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cover not found")
    
        db.delete(cover)
        db.commit()
        
        return {"message": "Project cover deleted successfully"}

