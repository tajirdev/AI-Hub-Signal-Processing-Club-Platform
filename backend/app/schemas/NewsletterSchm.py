from pydantic import BaseModel, EmailStr
from datetime import datetime

class SubscriberCreate(BaseModel):
    email: EmailStr

class SubscriberResponse(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class SubscribeStatus(BaseModel):
    message: str
    is_new: bool
