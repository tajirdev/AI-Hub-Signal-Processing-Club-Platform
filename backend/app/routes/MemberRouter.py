from fastapi import APIRouter,Depends
from app.services import MembersServ
from app.core.database import get_db
from app.core.auth import  get_current_user
from app.core.RoleAuth import RoleChecker
from app.schemas import MemberSchm
from app.models import ModoleMembers,ModoleUsers
from sqlalchemy.orm import Session


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

    return Services.CreateMember(sub_group_id,request,db,current_user_id=current_user.id)