from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class AuthorResponse(BaseModel):
    id: int
    full_name: Optional[str] = None
    author_order: int

    class Config:
        from_attributes = True


class ResearchCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=150)
    abstract: str = Field(..., min_length=30)
    content: str = Field(..., min_length=100)
    pdf_url: Optional[str] = None
    publication_date: Optional[datetime] = None
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


class ResearchResponse(BaseModel):
    id: int
    title: str
    slug: str
    abstract: str
    content: str
    publication_date: Optional[datetime]
    pdf_url: Optional[str]
    created_by: int
    featured: bool
    created_at: datetime
    updated_at: datetime
    authors: List[AuthorResponse] = []

    class Config:
        from_attributes = True