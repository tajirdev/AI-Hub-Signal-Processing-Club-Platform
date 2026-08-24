from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session  
from app.core.database import get_db
from typing import Annotated
from app.services import authentication
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.PasswordResetSchm import PasswordResetRequest, PasswordResetConfirm
from app.services.password_reset_service import PasswordResetService

router = APIRouter(tags=["authentication"])

@router.post("/login")
def login(request: Annotated[OAuth2PasswordRequestForm, Depends()], database: Session = Depends(get_db)):
    return authentication.login(request, database)

@router.post("/password-reset/request")
def request_password_reset(request: PasswordResetRequest, db: Session = Depends(get_db)):
    return PasswordResetService.request_reset(request.email, db)

@router.post("/password-reset/confirm")
def confirm_password_reset(request: PasswordResetConfirm, db: Session = Depends(get_db)):
    return PasswordResetService.confirm_reset(request.email, request.otp_code, request.new_password, db)
