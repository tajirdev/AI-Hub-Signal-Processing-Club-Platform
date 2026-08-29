from pydantic import BaseModel, EmailStr
from typing import Optional

class ApplicationOnboarding(BaseModel):
    email: EmailStr
    otp_code: str
    password: str
    user_name: str
    bio: Optional[str] = None
    subgroup_id: int
    github: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None
