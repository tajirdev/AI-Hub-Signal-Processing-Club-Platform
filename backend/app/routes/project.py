from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.RoleAuth import RoleChecker  
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.services import project_service

# Role needs
member_required = RoleChecker(["member", "editor", "super_admin"])

router = APIRouter(prefix="/projects", tags=["PROJECTS"])

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    request: ProjectCreate,
    current_user = Depends(member_required),
    db: Session = Depends(get_db)
):
    return project_service.create_project(db, request, current_user.id)

@router.get("", response_model=List[ProjectResponse])
def get_all_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    sort: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    current_user = Depends(member_required),
    db: Session = Depends(get_db)
):
    return project_service.get_projects(db, page, limit, search, sort, order)

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    current_user = Depends(member_required),
    db: Session = Depends(get_db)
):
    return project_service.get_project_by_id(db, project_id)

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    request: ProjectUpdate,
    current_user = Depends(member_required),
    db: Session = Depends(get_db)
):
    return project_service.update_project(db, project_id, request, current_user)

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    current_user = Depends(member_required),
    db: Session = Depends(get_db)
):
    return project_service.delete_project(db, project_id, current_user)