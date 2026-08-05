from fastapi import APIRouter,Depends
from app.schemas import EventSchm
from app.models import ModoleUsers
from app.core.RoleAuth import RoleChecker
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services import EventService
from app.core.auth import get_current_user
from typing import List



services = EventService.Event()


admin_required = RoleChecker(["super_admin"])

editor_required = RoleChecker(["editor"])

member_required = RoleChecker(["member", "editor", "super_admin"])



router = APIRouter(
    tags=["EVENTS"],
    prefix="/events"
)


@router.post("")
def PostNew(
    request:EventSchm.EventCreate,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(editor_required),
):
    return services.CreateEvent(request,db,current_user_id=current_user.id)



@router.get("",response_model=List[EventSchm.EventResponse])
def get_blog(
    db:Session=Depends(get_db),
    page:int=1,search:str=None,
    limit:int=10,
    status:str=None,sort:str="published_at",
    order:str="desc",
    current_user:ModoleUsers.Users=Depends(member_required)
    
    ):
    
    return services.ReturnAll(current_user,db,page,search,limit,status,sort,order)







@router.get("/me",response_model=List[EventSchm.EventResponse])
def GetMy(
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(editor_required)
):
    return services.ReturnMy(db,current_user_id=current_user.id)


@router.get("/{event_id}",response_model=EventSchm.EventResponse)
def GetSingle(
    event_id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(get_current_user)

):
    return services.ReturnSingle(event_id,db,current_user)


@router.put("/{event.id}")
def PutSingle(
    event_id:int,
    request:EventSchm.EventUpdate,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required)
):
    return services.Upadate(event_id,request,db,current_user_id=current_user.id)


@router.delete("{event_id}")
def DeleteEvent(
    event_id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required)

):
    return services.RemoveEvent(event_id,db)

@router.put("/me/{event_id}")
def PutMy(
    event_id:int,
    request:EventSchm.EventUpdate,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(editor_required)

): return services.EditeMy(event_id,request,db,current_user_id=current_user.id)


@router.delete("/me/{event_id}")
def DeleteMyEvent(
    event_id:int,
    db:Session=Depends(get_db),
    current_user :ModoleUsers.Users=Depends(editor_required)

):
    return services.RemoveMyEvent(event_id,db,current_user_id=current_user.id)

    









