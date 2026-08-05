from fastapi import APIRouter,Depends
from app.schemas import EventSchm
from app.models import ModoleUsers
from app.core.RoleAuth import RoleChecker
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services import EventService



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



@router.get("",response_model=list[EventSchm.EventResponse])
def get_blog(
    db:Session=Depends(get_db),
    page:int=1,search:str=None,
    limit:int=10,
    status:str=None,sort:str="published_at",
    order:str="desc",
    current_user:ModoleUsers.Users=Depends(member_required)
    
    ):
    
    return services.ReturnAll(current_user,db,page,search,limit,status,sort,order)