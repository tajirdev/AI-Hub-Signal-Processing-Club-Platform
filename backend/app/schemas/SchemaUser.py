from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional, List

class Users(BaseModel):
    first_name: str
    last_name: str
    user_name: str
    email: EmailStr
    password_hash: str
    phone: str
    bio: str
    otp: str

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
    avatar_id: Optional[int] = None
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    user_name: Optional[str] = None
