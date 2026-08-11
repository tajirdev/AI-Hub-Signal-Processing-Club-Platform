from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from app.core.RoleAuth import RoleChecker

class ResearchAuthorResponse(BaseModel):
    id: int
    user_id: int
    position: Optional[str] = None
    author_order: int

    model_config = ConfigDict(from_attributes=True)


class ResearchBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=150)
    abstract: str = Field(..., min_length=30)
    content: str = Field(..., min_length=100)
    pdf_url: Optional[str] = None
    publication_date: Optional[datetime] = None


class ResearchCreate(ResearchBase):
    author_ids: Optional[List[int]] = []
    featured: Optional[bool] = False


class ResearchUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=150)
    abstract: Optional[str] = Field(None, min_length=30)
    content: Optional[str] = Field(None, min_length=100)
    pdf_url: Optional[str] = None
    publication_date: Optional[datetime] = None
    author_ids: Optional[List[int]] = None
    featured: Optional[bool] = None


class ResearchResponse(ResearchBase):
    id: int
    slug: str
    created_by: int
    featured: bool
    created_at: datetime
    updated_at: datetime
    authors: List[ResearchAuthorResponse] = []

    model_config = ConfigDict(from_attributes=True)


class ResearchPaginatedResponse(BaseModel):
    total: int
    page: int
    limit: int
    pages: int
    data: List[ResearchResponse]