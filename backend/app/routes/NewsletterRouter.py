from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.NewsletterSchm import SubscriberCreate, SubscribeStatus, SubscriberResponse
from app.services import NewsletterServ
from app.core.RoleAuth import RoleChecker
from app.core.auth import get_current_user
from app.models.ModoleUsers import Users

admin_required = RoleChecker(["admin", "super_admin"])

router = APIRouter(prefix="/newsletter", tags=["Newsletter"])

@router.post("/subscribe", response_model=SubscribeStatus)
def subscribe_newsletter(
    subscriber: SubscriberCreate,
    db: Session = Depends(get_db)
):
    return NewsletterServ.subscribe(subscriber, db)

@router.get("/", response_model=List[SubscriberResponse])
def get_all_subscribers(
    db: Session = Depends(get_db),
    current_user: Users = Depends(admin_required)
):
    return NewsletterServ.get_subscribers(db)
