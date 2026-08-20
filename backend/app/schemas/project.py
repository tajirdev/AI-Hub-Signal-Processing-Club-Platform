from pydantic import BaseModel, Field,HttpUrl
from typing import Optional, List
from datetime import datetime

class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=100)
    description: str = Field(..., min_length=30)
    repository_url: Optional[HttpUrl] = None
    demo_url: Optional[HttpUrl] = None
    status: Optional[str] = "active"
    technology_stack: Optional[str] = None

    class Config:
        from_attributes = True
        

class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=100)
    description: Optional[str] = Field(None, min_length=30)
    repository_url: Optional[HttpUrl] = None
    demo_url: Optional[HttpUrl] = None
    status: Optional[str] = None
    technology_stack: Optional[str] = None

    class Config:
        from_attributes = True
        
class ProjectResponse(BaseModel):
    id: int
    title: Optional[str] = Field(None, min_length=5, max_length=100)
    description: Optional[str] = Field(None, min_length=30)
    repository_url: Optional[HttpUrl] = None
    demo_url: Optional[HttpUrl] = None
    status: Optional[str] = None
    technology_stack: Optional[str] = None    
    thumbnail_id: Optional[int] = None
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        
class PaginationResponse(BaseModel):
    page:int
    total_projects:int
    limit:int
    total_pages:int
    projects:List[ProjectResponse]
    
    class Config:
        from_attributes = True
            