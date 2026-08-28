from fastapi import APIRouter,Depends,File,UploadFile
from app.schemas import EventSchm
from app.models import ModoleUsers
from app.core.RoleAuth import RoleChecker
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services import EventService
from app.core.auth import get_current_user,get_optional_current_user
from typing import List,Optional
from app.services.storage.local import save_upload_file,UploadCategory,IMAGE_TYPES



services = EventService.Event


admin_required = RoleChecker(["super_admin"])

editor_required = RoleChecker(["editor"])

member_required = RoleChecker(["member", "editor", "super_admin"])



router = APIRouter(
    prefix="/events"
)



@router.post("/", tags=["EVENTS"])
def PostNew(
    request: EventSchm.EventCreate,
    db: Session = Depends(get_db),
    current_user: ModoleUsers.Users = Depends(editor_required),
):
    return services.CreateEvent(request, db, current_user_id=current_user.id)



@router.get("/", tags=["EVENTS"])
def get_blog(
    db: Session = Depends(get_db),
    page:int=1,search:str=None,
    limit:int=10,
    status:str=None,sort:str="published_at",
    order:str="desc",
    current_user:Optional[ModoleUsers.Users]=Depends(get_optional_current_user)
    
    ):
    
    return services.ReturnAll(current_user,db,page,search,limit,status,sort,order)







@router.get("/me", tags=["EVENTS"])
def GetMy(
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(editor_required)
):
    return services.ReturnMy(db,current_user_id=current_user.id)


@router.get("/{event_id}",response_model=EventSchm.EventResponse, tags=["EVENTS"])
def GetSingle(
    event_id:int,
    db:Session=Depends(get_db)
    

):
    return services.ReturnSingle(event_id,db)


@router.put("/{event_id}", tags=["EVENTS"])
def PutSingle(
    event_id:int,
    request:EventSchm.EventUpdate,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required)
):
    return services.Upadate(event_id,request,db,current_user_id=current_user.id)


@router.delete("/{event_id}", tags=["EVENTS"])
def DeleteEvent(
    event_id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required)

):
    return services.RemoveEvent(event_id,db)

@router.put("/me/{event_id}", tags=["EVENTS"])
def PutMy(
    event_id:int,
    request:EventSchm.EventUpdate,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(editor_required)

): return services.EditeMy(event_id,request,db,current_user_id=current_user.id)


@router.delete("/me/{event_id}", tags=["EVENTS"])
def DeleteMyEvent(
    event_id:int,
    db:Session=Depends(get_db),
    current_user :ModoleUsers.Users=Depends(editor_required)

):
    return services.RemoveMyEvent(event_id,db,current_user_id=current_user.id)


@router.post("/{event_id}/cover", tags=["EVENTS COVER"])
def Postcover(
    event_id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(editor_required),
    file:UploadFile=File(...)

):
    file_path = save_upload_file(
        file=file,
        allowed_types=IMAGE_TYPES,
        category=UploadCategory.EVENT_COVERS
    )

    upadate_cover = services.CreateCover(
        event_id=event_id,
        path=file_path,
        db=db,
        current_user_id=current_user.id,
    )


    return upadate_cover


@router.get("/{event_id}/cover",tags=["EVENTS COVER"])
def GetCover(
    event_id:int,
    db:Session=Depends(get_db)
    
):
    return services.GetCover(event_id,db)

@router.delete("/{event_id}/cover",tags=["EVENTS COVER"])
def DeleteCover(
    event_id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(editor_required)
):
    return services.RemoveCover(event_id,db,current_user_id=current_user.id)    
    









