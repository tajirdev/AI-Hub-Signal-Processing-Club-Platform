from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, HttpUrl, model_validator


class ResourceType(str, Enum):
    PDF = "PDF"
    PRESENTATION = "PRESENTATION"
    DATASET = "DATASET"
    VIDEO = "VIDEO"
    EXTERNAL_LINK = "EXTERNAL_LINK"

class ResourceBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=100, description="Resource title")
    description: Optional[str] = Field(None, max_length=500, description="Resource description")
    type: ResourceType
    file_url: Optional[HttpUrl] = None
    external_url: Optional[HttpUrl] = None
    subgroup_id: int

    @model_validator(mode="after")
    def validate_urls(self):
        if not self.file_url and not self.external_url:
            raise ValueError("Either file_url or external_url must be provided.")

        return self

class ResourceCreate(ResourceBase):
    pass

class ResourceUpdate(ResourceBase):
    title: Optional[str] = Field(None, min_length=5, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    type: Optional[ResourceType] = None
    file_url: Optional[HttpUrl] = None
    external_url: Optional[HttpUrl] = None
    subgroup_id: Optional[int] = None




    @model_validator(mode="after")
    def validate_urls(self):
        if(self.file_url is None and self.external_url is None):
            return self
        if not self.file_url and not self.external_url:
            raise ValueError("Either file_url or external_url must be provided.")
        return self





class ResourceResponse(ResourceBase):
    id: int
    description: Optional[str]
    type: Optional[ResourceType]=None
    file_url: Optional[HttpUrl]=None
    external_url: Optional[HttpUrl]=None
    subgroup_id: int
    uploaded_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
       from_attributes = True


        