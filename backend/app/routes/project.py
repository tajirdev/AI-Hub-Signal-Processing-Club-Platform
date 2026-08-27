from fastapi import APIRouter, Depends, Query, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from pathlib import Path
from app.services.project_service import ProjectService
from app.core.database import get_db
from app.core.RoleAuth import RoleChecker
from app.models.ModoleUsers import Users
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse,PaginationResponse
from app.services.storage.local import save_upload_file,UploadCategory,IMAGE_TYPES

member_required = RoleChecker(["member", "editor", "super_admin"])
editor_required = RoleChecker(["editor", "super_admin"])

router = APIRouter(prefix="/projects")

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED, tags=["PROJECTS"])
def create_project(
    request: ProjectCreate,
    current_user: Users = Depends(member_required),
    db: Session = Depends(get_db)
):
    return ProjectService.create_project(request, current_user, db)



@router.get("/", response_model=PaginationResponse, tags=["PROJECTS"])
def get_all_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    sort: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    subgroup_id: Optional[int] = Query(None, description="Filter by subgroup ID"),
    db: Session = Depends(get_db)
):
    return ProjectService.get_projects(db,page,limit,search,sort,order,subgroup_id)


@router.get("/{project_id}", response_model=ProjectResponse, tags=["PROJECTS"])
def get_project(
    project_id: int,
    db: Session = Depends(get_db)
):
  
    return ProjectService.get_project_by_id(db,project_id)


@router.put("/{project_id}", response_model=ProjectResponse, tags=["PROJECTS"])
def update_project(
    project_id: int,
    request:ProjectUpdate,
    current_user:Users=Depends(member_required),
    db: Session = Depends(get_db)
):
    return ProjectService.update_project(db,project_id,request, current_user)


@router.delete("/{project_id}", tags=["PROJECTS"])
def delete_project(
    project_id: int,
    current_user = Depends(member_required),
    db: Session = Depends(get_db)
):
    return ProjectService.delete_project(db=db, project_id=project_id, current_user=current_user)


# PROJECTS COVER (Dedicated Image Routes)


@router.post("/{project_id}/cover", tags=["PROJECTS COVER"])
def post_cover(
    project_id: int,
    file: UploadFile = File(...),
    current_user = Depends(member_required),
    db: Session = Depends(get_db)
):
    file_path=save_upload_file(
        file=file,
        allowed_types=IMAGE_TYPES,
        category=UploadCategory.PROJECT_THUMBNAILS,
    )
    cover=ProjectService.project_cover(
                project_id=project_id,
                db=db,
                path=file_path,
                original_filename=file.filename,
                current_user=current_user,
                mime_type=file.content_type,
                filename=Path(file_path).name
    )
    return cover

@router.get("/{project_id}/cover", tags=["PROJECTS COVER"])
def get_cover(
    project_id: int,
    db: Session = Depends(get_db)
):
    return ProjectService.get_cover(project_id, db=db)

@router.delete("/{project_id}/cover", tags=["PROJECTS COVER"])
def delete_cover(
    project_id: int,
    current_user = Depends(member_required),
    db: Session = Depends(get_db)
):
    return ProjectService.remove_cover(project_id=project_id, db=db, current_user=current_user)