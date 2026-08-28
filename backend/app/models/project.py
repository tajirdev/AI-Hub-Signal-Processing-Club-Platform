from sqlalchemy import Column, String, Integer, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    repository_url = Column(String, nullable=True,unique=False)
    demo_url = Column(String, nullable=True)
    thumbnail_id = Column(Integer,ForeignKey("media.id",ondelete="SET NULL"))
    status = Column(String, default="active")
    technology_stack = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime,default=datetime.now)
    updated_at = Column(DateTime,default=datetime.now, onupdate=datetime.now)

    # Centralized Media Relationship
    thumbnail = relationship("Media",back_populates="project")
    creator=relationship("Users",back_populates="project")