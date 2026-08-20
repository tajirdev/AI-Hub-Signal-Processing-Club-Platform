from fastapi import APIRouter,Depends,File,UploadFile
from app.models import ModoleUsers
from app.schemas import SubGroupSchm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.RoleAuth import RoleChecker
from app.services import SubGroupServ
from app.services.storage.local import save_upload_file,IMAGE_TYPES,UploadCategory

admin_required = RoleChecker(["super_admin"])

services = SubGroupServ.SubGroups



router = APIRouter(
    prefix="/sub_groups",
   
)

@router.post("", tags= ["SUB GROUPS"])
def new_group(
        request:SubGroupSchm.SubGroup,
        db:Session=Depends(get_db),
        current_user:ModoleUsers.Users=Depends(admin_required)
        ):

    
    return services.create_subgrp(request,db,current_user_id=current_user.id)


@router.get("", tags= ["SUB GROUPS"])
def return_all(
    db:Session= Depends(get_db)
    ,current_user:ModoleUsers.Users = Depends(get_current_user)
    ):
    return services.get_all(db)

@router.get("/{id}", tags= ["SUB GROUPS"])
def return_single(
    id: int,
    db:Session = Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required)
    ):
    return services.get_single(id,db)


@router.put("/{id}", tags= ["SUB GROUPS"])
def edite_group(
    id:int,
    request:SubGroupSchm.SubGroup,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users = Depends(admin_required)
    ):
    return services.update_group(id,request,db)


@router.delete("/{id}", tags= ["SUB GROUPS"])
def remove_group(
    id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users= Depends(admin_required)
    ):

    return services.delete_group(id,db)

# here is where cover upload router started
@router.post("/{subgroup_id}/cover_page",tags=["Cover"])
def PostCoverPage(
    subgroup_id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required),
    file:UploadFile=File(...)
):

    file_path = save_upload_file(
        file=file,
        allowed_types=IMAGE_TYPES,
        category=UploadCategory.SUBGROUP_LOGOS
    )

    updated_cover = services.AddCover(
        path=file_path,
        subGroup_id=subgroup_id,
        db=db,
        current_user_id=current_user.id
    )

    return updated_cover

@router.get("/{subgroup_id}/cover_page",tags=["Cover"])
def GetCover(
    subgroup_id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required)
):
    return services.ReturnCover( subgroup_id,db)


@router.delete("/{subgroup_id}/cover_page",tags=["Cover"])
def DeleteCover(
    subgroup_id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required)
):
    return services.RemoveCover(
        subgroup_id,db
    )

    
# here is where icon routers starts
@router.post("/{subgroup_id}/icon_page", tags=["Icon"])
def PostIcon(
    subgroup_id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required),
    file:UploadFile=File(...)
):

    file_path = save_upload_file(
        file=file,
        allowed_types=IMAGE_TYPES,
        category=UploadCategory.SUBGROUP_LOGOS
    )

    updated_icon = services.AddIcon(
        path=file_path,
        subGroup_id=subgroup_id,
        db=db,
        current_user_id=current_user.id
    )

    return updated_icon

@router.get("/{subgroup_id}/icon_page",tags=["Icon"])
def GetIcon(
    subgroup_id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required)
):
    return services.ReturnIcon( subgroup_id,db)


@router.delete("/{subgroup_id}/icon_page",tags=["Icon"])
def DeleteIcon(
    subgroup_id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required)
):
    return services.RemoveIcon(
        subgroup_id,db
    )