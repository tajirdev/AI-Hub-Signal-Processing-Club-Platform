from fastapi import Depends,HTTPException,status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import Hash
from app.core import jwt_token
from fastapi.security import  OAuth2PasswordRequestForm
from typing import Annotated
from app.models import ModoleUsers


def login(request: Annotated[OAuth2PasswordRequestForm, Depends()],db:Session= Depends(get_db)):

    user = db.query(ModoleUsers.Users).filter(ModoleUsers.Users.email == request.username).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Incorect password or username')
    
    if not Hash.verify_password(request.password,user.password_hash):
        raise  HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Incorect password or username')
    
     #  create token
    access_token = jwt_token.create_access_token(data = {
       "sub": str(user.id)
  
        
        
    })
    return {
        "access_token": access_token,
        "token_type": "bearer",
       
    }
