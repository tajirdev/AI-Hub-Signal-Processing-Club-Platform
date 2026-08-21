from .service import AdminService
from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.models import ModoleUsers
from app.core.database import get_db
from app.core.RoleAuth import RoleChecker

admin_required = RoleChecker(["super_admin"])


service= AdminService

router = APIRouter(
    prefix="/admin",
    tags=["ADMIN"]
)

@router.post("/{user_id}")
def PostAdmin(
    user_id:int,
    current_user:ModoleUsers.Users=Depends(admin_required),
    db:Session=Depends(get_db)

):
    return service.CreateAdmin(user_id,db)

@router.delete("/{user_id}")
def DeleteAdmin(
    user_id:int,
    current_user:ModoleUsers.Users=Depends(admin_required),
    db:Session=Depends(get_db)

):
    return service.RemoveAdmin(user_id,db)





