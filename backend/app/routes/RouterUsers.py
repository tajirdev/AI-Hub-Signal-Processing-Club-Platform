from fastapi import APIRouter,Depends,UploadFile,File
from app.models import ModoleUsers
from app.schemas import SchemaUser,MediaScham,RoleUpdate
from sqlalchemy.orm import Session
from app.core import database
from app .services.ServiceUsers import UserReg
from app.core.auth import get_current_user
from app.core.RoleAuth import RoleChecker
from app.services.storage.local import save_upload_file,UploadCategory,IMAGE_TYPES

UsersService = UserReg()
admin_required = RoleChecker(["super_admin"])
member_required = RoleChecker(["member", "editor", "super_admin"])


router = APIRouter(
    prefix="/users",
    tags= ["Users"]
)


@router.post("/registration")
def post_users(request:SchemaUser.Users,db:Session=Depends(database.get_db)):
    return UsersService.registerUser(request,db)

@router.get('/me', response_model=SchemaUser.UserResponse)
def get_me(db:Session=Depends(database.get_db),current_user:ModoleUsers.Users=Depends(get_current_user)):
    return UsersService.return_current_user(db,current_user_id=current_user.id)

@router.get('/all', response_model=list[SchemaUser.UserResponse])
def get_all(db:Session=Depends(database.get_db),current_user:ModoleUsers.Users=Depends(admin_required)):
    return UsersService.get_all(db,current_user_id=current_user.id)


@router.post("/avatar")
def post_avatar(
    current_user: ModoleUsers.Users = Depends(member_required),
    file: UploadFile = File(...),
    
    db: Session = Depends(database.get_db)
):
   
    file_path = save_upload_file(
        file=file,
        allowed_types=IMAGE_TYPES,
        category=UploadCategory.PROFILE_PICTURES
    )

    updated_avatar = UsersService.UpdateAvatar(
        
        path=file_path,
        db=db,
        current_user_id=current_user.id
    )

    return updated_avatar


@router.get("/avatar",response_model=MediaScham.AvatarResponse)
def GetAvatar(
    db:Session=Depends(database.get_db),
    current_user:ModoleUsers.Users=Depends(member_required)
):
    return UsersService.ReturnAvatar(db,current_user_id=current_user.id)


@router.delete("/avatar/{avatar_id}")
def DeleteAvatar(
  
    avatar_id:int,
    db:Session=Depends(database.get_db),
    current_user:ModoleUsers.Users=Depends(member_required)
    

):


    
    return UsersService.RemoveAvatar(avatar_id,db,current_user_id=current_user.id)
    
@router.post('/promote')
def promote_user(request: RoleUpdate.UserRoleUpdate, db: Session = Depends(database.get_db), current_user: ModoleUsers.Users = Depends(admin_required)):
    return UsersService.promote_user(db, request.user_id, request.role_name)

@router.post('/demote')
def demote_user(request: RoleUpdate.UserRoleUpdate, db: Session = Depends(database.get_db), current_user: ModoleUsers.Users = Depends(admin_required)):
    return UsersService.demote_user(db, request.user_id, request.role_name)

@router.delete('/{user_id}')
def delete_user(user_id: int, db: Session = Depends(database.get_db), current_user: ModoleUsers.Users = Depends(admin_required)):
    return UsersService.delete_user(db, user_id)

@router.put('/me', response_model=SchemaUser.UserResponse)
def update_me(request: SchemaUser.UserUpdate, db: Session = Depends(database.get_db), current_user: ModoleUsers.Users = Depends(get_current_user)):
    return UsersService.update_current_user(request, db, current_user.id)

@router.post("/{user_id}/toggle-active")
def toggle_user_active(user_id: int, db: Session = Depends(database.get_db), current_user: SchemaUser.Users = Depends(admin_required)):
    return UsersService.toggle_active(db, user_id,current_user_id=current_user.id)
