from pydantic import BaseModel, Field
from app.models.EventModel import EventStatus
from datetime import date, datetime
from typing import Optional
from app.schemas.category import CategoryResponse


class EventCreate(BaseModel):
    title: str = Field(min_length=5, max_length=100)
    description: str = Field(min_length=30)
    location: str
    event_date: date
    registration_link: Optional[str] = None
    category_id: Optional[int] = None
    status: EventStatus = EventStatus.draft


class EventUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=100)
    description: Optional[str] = Field(None, min_length=30)
    location: Optional[str] = None
    event_date: Optional[date] = None
    registration_link: Optional[str] = None
    category_id: Optional[int] = None
    status: Optional[EventStatus] = None


class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    location: str
    event_date: date
    registration_link: Optional[str] = None
    cover_image_id: Optional[int] = None
    category_id: Optional[int] = None
    category: Optional[CategoryResponse] = None
    status: str
    created_by: int

    class Config:
        from_attributes = True