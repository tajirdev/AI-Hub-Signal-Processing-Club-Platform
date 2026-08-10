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


@router.get("")
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

    return services.delete_group(id,db)


@router.post("{subgroup_id}/cover_page")
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

    



