from pydantic import BaseModel,EmailStr,HttpUrl
from datetime import datetime
from typing import Optional

class Users(BaseModel):
    first_name : str
    last_name : str
    user_name : str
    email : EmailStr
    password_hash: str
    phone : str
    bio : str
    github_link : HttpUrl

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    user_name: str
    email: EmailStr
    phone: Optional[str] = None
    bio: Optional[str] = None
    github_link: Optional[HttpUrl] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
