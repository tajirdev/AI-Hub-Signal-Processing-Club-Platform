from fastapi import APIRouter,Depends
from app.models import ModoleUsers
from app.schemas import SubGroupSchm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.RoleAuth import RoleChecker
from app.services import SubGroupServ

admin_required = RoleChecker(["super_admin"])

services = SubGroupServ.SubGroups()



router = APIRouter(
    prefix="/sub_groups",
    tags= ["SUB GROUPS"]
)

@router.post("")
def new_group(
        request:SubGroupSchm.SubGroup,
        db:Session=Depends(get_db),
        current_user:ModoleUsers.Users=Depends(admin_required)
        ):

    
    return services.create_subgrp(request,db,current_user_id=current_user.id)


@router.get("/all")
def return_all(
    db:Session= Depends(get_db)
    ,current_user:ModoleUsers.Users = Depends(get_current_user)
    ):
    return services.get_all(db)

@router.get("/{id}")
def return_single(
    id,
    db:Session = Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required)
    ):
    return services.get_single(id,db)


@router.put("/{id}")
def edite_group(
    id:int,
    request:SubGroupSchm.SubGroup,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users = Depends(admin_required)
    ):
    return services.update_group(id,request,db)


@router.delete("/{id}")
def remove_group(
    id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users= Depends(admin_required)
    ):

    return services.delete_group(id,db,current_user_id=current_user.id)



