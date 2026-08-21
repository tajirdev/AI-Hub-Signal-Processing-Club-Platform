from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.core.database import get_db
from app.schemas.news import NewsCreate, NewsUpdate, NewsResponse, PaginationResponse
from sqlalchemy.orm import Session
from app.services.news_services import News_Services
from app.models.ModoleUsers import Users
from app.core.auth import get_optional_current_user
from app.core.RoleAuth import RoleChecker

editor_required = RoleChecker(["super_admin", "editor"])

router = APIRouter(prefix="/News", tags=["News"])

@router.post("", response_model=NewsResponse)
def create(
    data: NewsCreate,
    current_user: Users = Depends(editor_required),
    db: Session = Depends(get_db)
):
    return News_Services.new_create(data, current_user, db)

@router.get("/", response_model=PaginationResponse)
def show_all(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    sort: str = "desc",
    order: Optional[str] = None,
    current_user: Optional[Users] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    return News_Services.get_all_news(db, page, limit, search, sort, order, current_user)

@router.get("/{news_id}", response_model=NewsResponse)
def show_id(
    news_id: int,
    current_user: Optional[Users] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    return News_Services.get_news_id(news_id, db, current_user)

@router.put("/{news_id}", response_model=NewsResponse)
def modify(
    news_id: int,
    data: NewsUpdate,
    current_user: Users = Depends(editor_required),
    db: Session = Depends(get_db)
):
    return News_Services.update_news(news_id, data, current_user, db)

@router.delete("/{news_id}")
def delete_news(
    news_id: int,
    current_user: Users = Depends(editor_required),
    db: Session = Depends(get_db)
):
    return News_Services.delete_news(news_id, current_user, db)
                     
    