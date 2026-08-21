from pydantic import BaseModel, ConfigDict
from app.models.newsmodel import StatusCheck
from datetime import datetime
from typing import Optional, List
from app.schemas.category import CategoryResponse

class NewsCreate(BaseModel):
    title: str
    summary: str
    content: str
    news_type: str
    status: StatusCheck
    category_id: int

    model_config = ConfigDict(from_attributes=True)

class NewsUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    news_type: Optional[str] = None
    category_id: Optional[int] = None
    status: Optional[StatusCheck] = None

    model_config = ConfigDict(from_attributes=True)

class NewsResponse(BaseModel):
    id: int
    title: str
    slug: str
    summary: str
    content: str
    news_type: str
    status: StatusCheck
    author_id: int
    category_id: Optional[int] = None
    category: Optional[CategoryResponse] = None
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PaginationResponse(BaseModel):
    page: int
    limit: int
    total: int
    total_pages: int
    news: List[NewsResponse]
            