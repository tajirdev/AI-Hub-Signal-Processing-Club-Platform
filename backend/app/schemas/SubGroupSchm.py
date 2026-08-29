from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class LeaderBrief(BaseModel):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    user_name: Optional[str] = None
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class SubGroup(BaseModel):
    name: str = Field(max_length=150)
    description: str = Field(min_length=30)
    lead_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class SubGroupResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    lead_id: Optional[int] = None
    leader: Optional[LeaderBrief] = None
    icon_id: Optional[int] = None
    cover_page_id: Optional[int] = None
    icon_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    created_at: Optional[datetime] = None
    upadated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
