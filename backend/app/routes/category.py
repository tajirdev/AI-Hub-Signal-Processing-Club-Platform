from fastapi import APIRouter,Depends
from typing import List
from app.models.ModoleUsers import Users
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.RoleAuth import RoleChecker
from app.core.auth import get_current_user
from app.schemas.category import CategoryCreate,CategoryUpdate,CategoryResponse
from app.services.category_services import CategoryService


services = CategoryService()

admin_required = RoleChecker([ "super_admin"])

router= APIRouter(
    prefix="/category",
    tags=["Categories"]
)

@router.post("", response_model=CategoryResponse)
@router.post("/create", response_model=CategoryResponse)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(admin_required)
):
    return services.create_category(data, db)


@router.get("",response_model=list[CategoryResponse])
def get_category(db:Session=Depends(get_db)):
    
    return services.show_all_categories(db)

@router.get("/{category_id}",response_model=CategoryResponse)
def single(category_id:int,db:Session=Depends(get_db)):
    return services.show_single(category_id,db)

@router.put("/{category_id}",response_model=CategoryResponse)
def update(category_id:int,data:CategoryUpdate,current_user:Users=Depends(admin_required),db:Session=Depends(get_db)):
    return services.update_category(category_id,data,db)


@router.delete("/{category_id}")
def delete(category_id:int,current_user:Users=Depends(admin_required),db:Session=Depends(get_db)):
    return services.delete_category(category_id,db)