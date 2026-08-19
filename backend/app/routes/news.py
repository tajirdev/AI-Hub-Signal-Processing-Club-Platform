from fastapi import APIRouter,Depends,Query
from app.core.database import get_db
from app.schemas.news import NewsCreate,NewsUpdate,NewsResponse,PaginationResponse
from sqlalchemy.orm import Session
from app.services import news_services
from app.models.ModoleUsers import Users
from app.core.auth import get_current_user
from app.core.RoleAuth import RoleChecker

editor_required=RoleChecker(["super_admin","editor"])

router=APIRouter(prefix="/News",tags=["News"])

@router.post("/new news",response_model=NewsResponse)
def create(data:NewsCreate,
           current_user:Users=Depends(editor_required),
           db:Session=Depends(get_db)):
    return news_services.new_create(data,current_user,db)

@router.get("/",response_model=PaginationResponse)
def show_all(
       page:int=Query(1,ge=1),
       limit:int=Query(10,ge=10,le=100),
       search:str=None,sort:str="desc",order:str=None,
       db:Session=Depends(get_db)
                  ):
       return news_services.get_all_news(db,page,limit,search,sort)

@router.get("/{news_id}",response_model=NewsResponse)
def show_id(news_id:int,db:Session=Depends(get_db)):
       return news_services.get_news_id(news_id,db)


@router.put("/{news_id}",response_model=NewsResponse)
def modify(news_id:int,data:NewsUpdate,
           current_user:Users=Depends(editor_required),
           db:Session=Depends(get_db)):
       return news_services.update_news(news_id,data,current_user,db)
       

@router.delete("/{news_id}")
def show_id(news_id:int,
            current_user:Users=Depends(editor_required),
            db:Session=Depends(get_db)):
       return news_services.delete_news(news_id,current_user,db)
                     
    