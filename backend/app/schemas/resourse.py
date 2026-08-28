from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.MediaScham import MediaResponse

class ResourceType(str, Enum):
    PDF = "PDF"
    PRESENTATION = "PRESENTATION"
    DATASET = "DATASET"
    VIDEO = "VIDEO"
    EXTERNAL_LINK = "EXTERNAL_LINK"

class ResourceBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=150, description="Resource title")
    description: Optional[str] = Field(None, max_length=1000, description="Resource description")
    type: ResourceType = ResourceType.PDF
    external_url: Optional[str] = None
    file_id: Optional[int] = None
    subgroup_id: int

    model_config = ConfigDict(from_attributes=True)

class ResourceCreate(ResourceBase):
    pass

class ResourceUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=150)
    description: Optional[str] = Field(None, max_length=1000)
    type: Optional[ResourceType] = None
    file_id: Optional[int] = None
    external_url: Optional[str] = None
    subgroup_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class ResourceResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    type: Optional[ResourceType] = None
    file_id: Optional[int] = None
    external_url: Optional[str] = None
    file: Optional[MediaResponse] = None
    subgroup_id: int
    uploaded_by: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


        
class ResourcePagination(BaseModel):
    total: int
    page: int
    limit: int
    returned: int
    results: list[ResourceResponse]

    model_config = ConfigDict(from_attributes=True)
