import re

filepath = 'backend/app/routes/NewsletterRouter.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

new_imports = """from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.NewsletterSchm import SubscriberCreate, SubscribeStatus, SubscriberResponse
from app.services import NewsletterServ
from app.core.RoleAuth import RoleChecker
from app.core.auth import get_current_user
from app.models.ModoleUsers import Users

admin_required = RoleChecker(["admin", "super_admin"])"""

text = text.replace("from fastapi import APIRouter, Depends\nfrom sqlalchemy.orm import Session\nfrom app.core.database import get_db\nfrom app.schemas.NewsletterSchm import SubscriberCreate, SubscribeStatus\nfrom app.services import NewsletterServ", new_imports)

new_route = """
@router.get("/", response_model=List[SubscriberResponse])
def get_all_subscribers(
    db: Session = Depends(get_db),
    current_user: Users = Depends(admin_required)
):
    return NewsletterServ.get_subscribers(db)
"""

text = text + new_route

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
