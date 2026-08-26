from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class ContactBase(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    status: str

class ContactOut(ContactBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
