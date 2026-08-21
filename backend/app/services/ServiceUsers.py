from fastapi import HTTPException,status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.schemas import SchemaUser
from app.models import ModoleUsers,ModoleRoles,ModelUserRoles,media
from app.core import security
from .storage.local import delete_upload_file
from pathlib import Path

# all services should be here for user
class UserReg:
   def __init__(self):
      pass
  
   def registerUser(self,request:SchemaUser.Users,db:Session):
    new_user =ModoleUsers.Users(
        first_name = request.first_name,
        last_name = request.last_name,
        email = request.email,
        password_hash = security.Hash.hash(request.password_hash),
        phone = request.phone,
        bio = request.bio,
       
        user_name = request.user_name
        


    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback() 
        raise HTTPException(status_code=400, detail="Conflict: Data already exists.")  
    
   

    member_role = (
        db.query(ModoleRoles.Role)
        .filter(ModoleRoles.Role.name == "user")
        .first()
    )

    if not member_role:
        raise HTTPException(
            status_code=500,
            detail="Default role 'member' not found."
        )

    user_role = ModelUserRoles.UserRole(
        user_id=new_user.id,
        role_id=member_role.id
    )

    db.add(user_role)
    db.commit()
    db.refresh(user_role)
    
    return {"message":"user has been created"}
   
   def return_current_user(self,db:Session,current_user_id:int):
        active_user = db.query(ModoleUsers.Users).filter(ModoleUsers.Users.id == current_user_id).first()
        return active_user
   
   def get_all(self,db:Session):
      users = db.query(ModoleUsers.Users).all()
      return users


   def UpdateAvatar(
     self, 
     db: Session,
     current_user_id: int,
     path: str,
):


    user = db.query(ModoleUsers.Users).filter(
       ModoleUsers.Users.id == current_user_id
        ).first()  
    avatar = db.query(media.Media).filter(
        media.Media.id == user.avatar_id
    ).first()



    if avatar:
  
        avatar.filename = path
        delete_upload_file(avatar.path)
        avatar.path = path 
        avatar.original_filename = "avatar"
    else:
       
        avatar = media.Media(
            filename=path,
            path=path,
            original_filename= "avatar",
            uploaded_by=current_user_id,
            mime_type="image/jpeg" 
        )
        db.add(avatar)
        db.flush()
    user.avatar_id =avatar.id

    db.commit()
    db.refresh(avatar)



    return avatar


   def ReturnAvatar(self,db:Session,current_user_id:int):

      user = db.query(ModoleUsers.Users).filter(
         ModoleUsers.Users.id == current_user_id
      ).first()
      avatar = db.query(media.Media).filter(
         media.Media.id == user.avatar_id
      ).first()

      if not avatar:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="you don't have avatar upload one"
         )

      

      return avatar


   def RemoveAvatar(self,avatar_id:int,db:Session,current_user_id:int):

      user = db.query(ModoleUsers.Users).filter(
         ModoleUsers.Users.id == current_user_id
      ).first()

      user_roles = db.query(ModelUserRoles.UserRole).filter(
         ModelUserRoles.UserRole.user_id == current_user_id
      ).all()

      is_super_admin = False
      for user_role in user_roles:
         admin = db.query(ModoleRoles.Role).filter(
            ModoleRoles.Role.id == user_role.role_id
         ).first()
         if admin and admin.name == "super_admin":
            is_super_admin = True
            break

      avatar = db.query(media.Media).filter(
         media.Media.id == avatar_id
      ).first()

      if not avatar:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail= f"avatar with id of {avatar_id} not found"
         )

      if not is_super_admin and avatar.id != user.avatar_id:
         raise HTTPException(
                     status_code=status.HTTP_403_FORBIDDEN,
                     detail="your are not the owner"
                  )

      delete_upload_file(avatar.path)
      user.avatar_id = None
      db.delete(avatar)
      db.commit()

      return {"message":"avatar have been deleted"}
         

      







   

      

    