from fastapi import APIRouter, Depends, Query, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.services.project_service import projectService, projectCoverService
from app.core.database import get_db
from app.core.RoleAuth import RoleChecker
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.services.project_service import projectService

member_required = RoleChecker(["member", "editor", "super_admin"])
router = APIRouter(prefix="/projects", tags=["PROJECTS"])

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    title: str = Form(...),
    description: str = Form(...),
    repository_url: Optional[str] = Form(None),
    demo_url: Optional[str] = Form(None),
    status: Optional[str] = Form("active"),
    technology_stack: Optional[str] = Form(None),
    current_user = Depends(member_required),
    db: Session = Depends(get_db)
):
    request = ProjectCreate(
        title=title,
        description=description,
        repository_url=repository_url,
        demo_url=demo_url,
        status=status,
        technology_stack=technology_stack
    )
    return projectService.create_project(request=request, db=db, user_id=current_user.id)


@router.get("/", response_model=List[ProjectResponse])
def get_all_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    sort: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    db: Session = Depends(get_db)
):
    return projectService.get_projects(db, page=page, limit=limit, search=search, sort=sort, order=order)


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    return projectService.get_project_by_id(db=db, project_id=project_id)


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    repository_url: Optional[str] = Form(None),
    demo_url: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    technology_stack: Optional[str] = Form(None),
    current_user = Depends(member_required),
    db: Session = Depends(get_db)
):
    request = ProjectUpdate(
        title=title,
        description=description,
        repository_url=repository_url,
        demo_url=demo_url,
        status=status,
        technology_stack=technology_stack
    )
    return projectService.update_project(db=db, project_id=project_id, request=request, current_user=current_user)


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    current_user = Depends(member_required),
    db: Session = Depends(get_db)
):
    return projectService.delete_project(db=db, project_id=project_id, current_user=current_user)


# PROJECTS COVER (Dedicated Image Routes)

cover_router = APIRouter(prefix="/projects", tags=["PROJECTS COVER"])

@cover_router.post("/{project_id}/cover")
def post_cover(
    project_id: int,
    file: UploadFile = File(...),
    current_user = Depends(member_required),
    db: Session = Depends(get_db)
):
    return projectCoverService.upload_cover(project_id=project_id, file=file, db=db, current_user=current_user)

@cover_router.get("/{project_id}/cover")
def get_cover(
    project_id: int,
     current_user = Depends(member_required),
    db: Session = Depends(get_db)
):
    return projectCoverService.get_cover(project_id=project_id, db=db)

@cover_router.delete("/{project_id}/cover")
def delete_cover(
    project_id: int,
    current_user = Depends(member_required),
    db: Session = Depends(get_db)
):
    return projectCoverService.remove_cover(project_id=project_id, db=db, current_user=current_user)