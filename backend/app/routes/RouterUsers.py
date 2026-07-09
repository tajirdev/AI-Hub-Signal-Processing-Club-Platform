from fastapi import APIRouter,Depends
from app.models import ModoleUsers
from app.schemas import SchemaUser
from sqlalchemy.orm import Session
from app.core import database
from app .services.ServiceUsers import UserReg
from app.core.auth import get_current_user

UsersService = UserReg()


router = APIRouter(
    prefix="/users",
    tags= ["Users"]
)


@router.post("/registration")
def post_users(request:SchemaUser.Users,db:Session=Depends(database.get_db)):
    return UsersService.registerUser(request,db)

@router.get('/me')
def get_me(db:Session=Depends(database.get_db),current_user:ModoleUsers.Users=Depends(get_current_user)):
    return UsersService.return_current_user(db,current_user_id=current_user.id)