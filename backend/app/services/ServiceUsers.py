from fastapi import HTTPException,status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.schemas import SchemaUser
from app.models import ModoleUsers
from app.core import security


# all services should be here for user
class UserReg:
  
   def registerUser(self,request:SchemaUser.Users,db:Session):
    new_user =ModoleUsers.Users(
        first_name = request.first_name,
        last_name = request.last_name,
        email = request.email,
        password_hash = security.Hash.hash(request.password_hash),
        phone = request.phone,
        avatar = request.avatar,
        bio = request.bio,
        github_link = request.github_link,
        user_name = request.user_name
        


    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback() 
        raise HTTPException(status_code=400, detail="Conflict: Data already exists.")  
    
    return new_user
   
   def return_current_user(self,db:Session,current_user_id:int):
        active_user = db.query(ModoleUsers.Users).filter(ModoleUsers.Users.id == current_user_id).first()
        return active_user
   

    