
from pydantic import BaseModel,Field
from app.models.EventModel import EventStatus
from datetime import date


class EventCreate(BaseModel):
    title :str = Field(min_length=5,max_length=100)
    description :str = Field(min_length=30)
    location : str
    event_date :date
    registration_link : str | None=None
    cover_image : str | None=None
    status : EventStatus = EventStatus.draft


class EventUpdate(BaseModel):
    title :str = Field(min_length=5,max_length=100)
    description :str = Field(min_length=30)
    location : str
    event_date :date
    registration_link : str | None=None
    cover_image : str | None=None
    status :  EventStatus= EventStatus.draft

class EventResponse(BaseModel):
    title :str 
    description :str
    location : str
    event_date :date
    registration_link : str | None=None
    cover_image : str | None=None
    status : str


    class Config:
        from_attributes = True



    









