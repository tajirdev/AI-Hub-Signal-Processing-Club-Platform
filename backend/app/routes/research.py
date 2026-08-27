from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File
from app.core.database import get_db
from sqlalchemy.orm import Session
from app.schemas.research import ResearchCreate, ResearchResponse, Researchupdate
from app.services.research import ResearchServices, ResearchMediaService
from app.services.storage.local import save_upload_file, UploadCategory, DOCUMENT_TYPES
from app.models.ModoleUsers import Users
from app.core.RoleAuth import RoleChecker
from app.core.auth import get_optional_current_user

member_required = RoleChecker(["member", "editor", "super_admin"])
editor_required = RoleChecker(["editor", "super_admin"])

router = APIRouter(prefix="/research", tags=["Research"])

@router.post("/", response_model=ResearchResponse)
def New_research(
    data: ResearchCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(editor_required)
):
    return ResearchServices.addresearch(data, db, current_user)

@router.get("/", response_model=list[ResearchResponse])
def show_all(
    db: Session = Depends(get_db),
    current_user: Optional[Users] = Depends(get_optional_current_user),
    page: int = 1,
    search: Optional[str] = None,
    limit: int = 10,
    title: Optional[str] = None,
    sort: str = "publication_date",
    order: str = "desc",
    subgroup_id: Optional[int] = None
):
    return ResearchServices.show_all(db, current_user, page, search, limit, title, sort, order, subgroup_id)

@router.get("/{research_id}", response_model=ResearchResponse)
def show_by_id(
    research_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[Users] = Depends(get_optional_current_user)
):
    return ResearchServices.show_by_id(research_id, db, current_user)

@router.put("/{research_id}",response_model=ResearchResponse)
def update(research_id:int,data:Researchupdate,db:Session=Depends(get_db),current_user:Users=Depends(editor_required)):
    return ResearchServices.update(research_id,data,db,current_user)

@router.delete("/{research_id}")
def delete(research_id:int,db:Session=Depends(get_db),current_user:Users=Depends(editor_required)):
    return ResearchServices.deleteresource(research_id,db,current_user)

@router.post("/{research_id}/file", tags=["RESEARCH FILE"])
def post_file(
    research_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(editor_required),
    file: UploadFile = File(...)
):
    allowed = DOCUMENT_TYPES + ["application/pdf"]
    file_path = save_upload_file(
        file=file,
        allowed_types=allowed,
        category=UploadCategory.RESEARCH_FILES
    )
    return ResearchMediaService.CreateFile(
        research_id=research_id,
        path=file_path,
        mime_type=file.content_type,
        original_filename=file.filename,
        db=db,
        current_user_id=current_user.id
    )

@router.delete("/{research_id}/file", tags=["RESEARCH FILE"])
def delete_file(
    research_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(editor_required)
):
    return ResearchMediaService.RemoveFile(research_id, db, current_user.id)