from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.RoleAuth import RoleChecker
from app.models.ModoleUsers import Users
from app.schemas.resourse import ResourceCreate, ResourceUpdate, ResourceResponse
from app.services.resource_service import ResourceService
router = APIRouter(
    prefix="/resources",
    tags=["Resources"],)

#Role-based access control dependency
editor_required = RoleChecker(["editor", "super_admin"])
member_required = RoleChecker(["member", "editor", "super_admin"])

#Upload a new resource
@router.post("/", response_model=ResourceResponse, status_code=201)
def create_resource(resource: ResourceCreate, db: Session = Depends(get_db), current_user: Users = Depends(editor_required)):
    return ResourceService.create_resource(db=db, resource=resource, uploaded_by=current_user.id)

#get all resources
@router.get("/", response_model=list[ResourceResponse])
def get_all_resources(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
    search: Optional[str] = None, 
    subgroup_id: Optional[int] = None, 
    sort: str = "created_at", 
    order: str = "desc", resource_type: Optional[str] = None,
    current_user: Users = Depends(member_required), 
    db: Session = Depends(get_db)):

    return ResourceService.get_all_resources(
        db=db, page=page, 
        limit=limit, search=search, 
        subgroup_id=subgroup_id, sort=sort, order=order, resource_type=resource_type)

#get a resource by id
@router.get("/{resource_id}", response_model=ResourceResponse)
def get_resource_by_id(resource_id: int, current_user: Users = Depends(member_required), db: Session = Depends(get_db)):
    return ResourceService.get_resource_by_id(db=db, resource_id=resource_id)

#Update a resource
@router.put("/{resource_id}", response_model=ResourceResponse)
def update_resource(resource_id: int, resource: ResourceUpdate, current_user: Users = Depends(editor_required), db: Session = Depends(get_db)):
    return ResourceService.update_resource(resource_id=resource_id, request=resource, db=db, current_user=current_user)

#Delete a resource
@router.delete("/{resource_id}")
def delete_resource(resource_id: int, current_user: Users = Depends(editor_required), db: Session = Depends(get_db)):
    return ResourceService.delete_resource(resource_id, db, current_user)