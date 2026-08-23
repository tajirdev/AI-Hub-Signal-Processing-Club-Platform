from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.RoleAuth import RoleChecker
from app.models.ModoleUsers import Users
from app.schemas.resourse import ResourceCreate, ResourceUpdate, ResourceResponse
from app.services.resource_service import ResourceService, ResourceMediaService
from app.services.storage.local import save_upload_file, UploadCategory, DOCUMENT_TYPES, IMAGE_TYPES, VIDEO_TYPES

router = APIRouter(
    prefix="/resources",
    tags=["Resources"],)

from app.core.auth import get_optional_current_user

#Role-based access control dependency
editor_required = RoleChecker(["editor", "super_admin"])
member_required = RoleChecker(["member", "editor", "super_admin"])

#Upload a new resource
@router.post("/", response_model=ResourceResponse, status_code=201)
def create_resource(resource: ResourceCreate, db: Session = Depends(get_db), current_user: Users = Depends(editor_required)):
    return ResourceService.create_resource(db=db, resource=resource, uploaded_by=current_user.id)

#get all resources
@router.get("/")
def get_all_resources(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
    search: Optional[str] = None, 
    subgroup_id: Optional[int] = None, 
    sort: str = "created_at", 
    resource_type: Optional[str] = None,
    order: str = "desc",
    current_user: Optional[Users] = Depends(get_optional_current_user), 
):
    return ResourceService.get_all_resources(
        db, page, 
        limit, search, 
        subgroup_id, resource_type, sort, sort_order=order
    )

#get a resource by id
@router.get("/{resource_id}", response_model=ResourceResponse)
def get_resource_by_id(resource_id: int, current_user: Optional[Users] = Depends(get_optional_current_user), db: Session = Depends(get_db)):
    return ResourceService.get_resource_by_id(db=db, resource_id=resource_id)

#Update a resource
@router.put("/{resource_id}", response_model=ResourceResponse)
def update_resource(resource_id: int, resource: ResourceUpdate, current_user: Users = Depends(editor_required), db: Session = Depends(get_db)):
    return ResourceService.update_resource(resource_id=resource_id, request=resource, current_user=current_user, db=db)

#Delete a resource
@router.delete("/{resource_id}")
def delete_resource(resource_id: int, current_user: Users = Depends(editor_required), db: Session = Depends(get_db)):
    return ResourceService.delete_resource(resource_id, db, current_user)

@router.post("/{resource_id}/file", tags=["RESOURCES FILE"])
def post_file(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(editor_required),
    file: UploadFile = File(...)
):
    allowed = DOCUMENT_TYPES + IMAGE_TYPES + VIDEO_TYPES
    file_path = save_upload_file(
        file=file,
        allowed_types=allowed,
        category=UploadCategory.RESOURCES
    )
    return ResourceMediaService.CreateFile(
        resource_id=resource_id,
        path=file_path,
        mime_type=file.content_type,
        original_filename=file.filename,
        db=db,
        current_user_id=current_user.id
    )

@router.delete("/{resource_id}/file", tags=["RESOURCES FILE"])
def delete_file(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(editor_required)
):
    return ResourceMediaService.RemoveFile(resource_id, db, current_user.id)
