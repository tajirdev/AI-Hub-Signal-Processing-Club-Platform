from fastapi import APIRouter,Depends,Query
from app.services import MembersServ
from app.core.database import get_db
from app.core.auth import  get_current_user
from app.core.RoleAuth import RoleChecker
from app.schemas import MemberSchm
from app.models import ModoleUsers
from sqlalchemy.orm import Session
from typing import List


admin_required = RoleChecker(["super_admin"])

editor_required = RoleChecker(["editor"])

member_required = RoleChecker(["member", "editor", "super_admin"])




Services = MembersServ.MembersServices()

router = APIRouter(
    tags=["MEMBER"],
    prefix="/member"
)


@router.post("/{sub_group_id}")
def PostMember(
    sub_group_id:int,
    request:MemberSchm.Members,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(member_required)
):

    return Services.CreateMember(
        sub_group_id,
        request,
        db,
        current_user_id=current_user.id
        )



@router.get("")
def All(
    db:Session=Depends(get_db),
    skip:int = Query(0, ge=0),
    limit: int = Query(
        10,
        ge=1,
        le = 100
        ),
    search : str | None = None,
    sort_by : str = "joined_at",
    order : str = "desc"    
    ):
    return Services.GetAll(db,skip,limit,search,sort_by,order)
