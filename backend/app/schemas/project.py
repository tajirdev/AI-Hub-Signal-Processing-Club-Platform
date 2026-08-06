from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime

class ProjectBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=100)
    description: str = Field(..., min_length=30)
    repository_url: Optional[str] = None
    demo_url: Optional[str] = None
    thumbnail: Optional[str] = None
    status: Optional[str] = "active"
    technology_stack: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=100)
    description: Optional[str] = Field(None, min_length=30)
    repository_url: Optional[str] = None
    demo_url: Optional[str] = None
    thumbnail: Optional[str] = None
    status: Optional[str] = None
    technology_stack: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True