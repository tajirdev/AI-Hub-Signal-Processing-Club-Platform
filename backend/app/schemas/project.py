from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ProjectBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=100)
    description: str = Field(..., min_length=30)
    repository_url: Optional[str] = None
    demo_url: Optional[str] = None
    status: Optional[str] = "active"
    technology_stack: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=100)
    description: Optional[str] = Field(None, min_length=30)
    repository_url: Optional[str] = None
    demo_url: Optional[str] = None
    status: Optional[str] = None
    technology_stack: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: int
    thumbnail_id: Optional[int] = None
    thumbnail: Optional[str] = None
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    @classmethod
    def from_orm_custom(cls, project):
        return cls(
            id=project.id,
            title=project.title,
            description=project.description,
            repository_url=project.repository_url,
            demo_url=project.demo_url,
            status=project.status,
            technology_stack=project.technology_stack,
            thumbnail_id=project.thumbnail_id,
            thumbnail=project.thumbnail.path if project.thumbnail else None,
            created_by=project.created_by,
            created_at=project.created_at,
            updated_at=project.updated_at
        )

    class Config:
        from_attributes = True