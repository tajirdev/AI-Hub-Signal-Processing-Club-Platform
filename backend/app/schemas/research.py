from pydantic import BaseModel,HttpUrl,ConfigDict,Field
from datetime import date,datetime
from typing import Optional
from app.schemas.MediaScham import MediaResponse

class ResearchCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    abstract: str = Field(min_length=10, max_length=1500)
    content: str = Field(min_length=30)
    file_id: Optional[int] = None
    featured: bool = False
    is_published: bool = False
    publication_date: datetime | None = None
    author_ids: list[int]
    
    model_config = ConfigDict(from_attributes=True) 
    
class Researchupdate(BaseModel):
    title: Optional[str] = None
    abstract: Optional[str] = None
    content: Optional[str] = None
    file_id: Optional[int] = None
    publication_date: Optional[datetime] = None
    author_ids: Optional[list[int]] = None
    featured: Optional[bool] = None
    is_published: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True) 
    
class ResearchAuthorResponse(BaseModel):
    member_id:int
    author_order:int
    model_config=ConfigDict(from_attributes=True)

class ResearchResponse(BaseModel):
    id:int
    title:str
    slug:str
    publication_date:datetime |None = None
    abstract:str
    content:str
    file_id: Optional[int] = None
    file: Optional['MediaResponse'] = None
    featured:bool = False
    is_published:bool = False
    created_by:int
    created_at:datetime
    updated_at:datetime
    
    authors:list[ResearchAuthorResponse]=[]
    
    model_config=ConfigDict(from_attributes=True)
