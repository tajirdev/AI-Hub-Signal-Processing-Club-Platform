from fastapi import APIRouter,Depends
from typing import List
from app.models.ModoleUsers import Users
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.RoleAuth import RoleChecker
from app.schemas.category import CategoryCreate,CategoryUpdate,CategoryResponse
from app.services.category_services import create_category,show_all_categories,show_single,update_category,delete_category


admin_required = RoleChecker([ "super_admin"])

router= APIRouter(
    prefix="/category",
    tags=["Categories"]
)

@router.post("/create",response_model=CategoryResponse)
def create_category(data:CategoryCreate,current_user:Users=Depends(admin_required),db:Session=Depends(get_db)):
    return create_category(data,db)


@router.get("",response_model=list[CategoryResponse])
def get_category(current_user:Users=Depends(admin_required),db:Session=Depends(get_db)):
    
    return show_all_categories(db)

@router.get("/{category_id}",response_model=CategoryResponse)
def single(category_id:int,current_user:Users=Depends(admin_required),db:Session=Depends(get_db)):
    return show_single(category_id,db)

@router.put("/{category_id}",response_model=CategoryResponse)
def update(category_id:int,data:CategoryUpdate,current_user:Users=Depends(admin_required),db:Session=Depends(get_db)):
    return update_category(category_id,data,db)


@router.delete("/{category_id}")
def delete(category_id:int,current_user:Users=Depends(admin_required),db:Session=Depends(get_db)):
    return delete_category(category_id,db)