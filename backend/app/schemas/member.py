from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Common attributes
class MemberBase(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    role: Optional[str] = "member"

#schema for member creation(sub_group_id)
class MemberCreate(MemberBase):
    pass

# update members (PUT)
class MemberUpdatePUT(MemberBase):
    is_active: Optional[bool] = True

# (PATCH)
class MemberUpdatePATCH(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

# (Response)
class MemberResponse(MemberBase):
    id: str
    sub_group_id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True