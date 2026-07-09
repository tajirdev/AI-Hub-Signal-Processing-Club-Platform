from fastapi import APIRouter,Depends
from app.models import ModoleUsers
from app.schemas import SchemaUser
from sqlalchemy.orm import Session
from app.core import database
from app .services.ServiceUsers import UserReg


UsersService = UserReg()


router = APIRouter(
    prefix="/users",
    tags= ["Users"]
)


@router.post("/registration")
def post_users(request:SchemaUser.Users,db:Session=Depends(database.get_db)):
    return UsersService.registerUser(request,db)