from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class Users(BaseModel):
    first_name : str
    last_name : str
    user_name : str
    email : EmailStr
    password_hash: str
    phone : str
    bio : str
   

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    user_name: str
    email: EmailStr
    phone: Optional[str] = None
    bio: Optional[str] = None
    is_active: bool
    roles: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True
