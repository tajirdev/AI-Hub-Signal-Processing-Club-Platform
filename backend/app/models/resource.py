from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, CheckConstraint, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class Role(str, enum.Enum):
    super_admin = "super_admin"

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String(30), nullable=False)
    file_id = Column(Integer, ForeignKey("media.id",ondelete="SET NULL"), nullable=True)
    external_url = Column(String(500), nullable=True)
    subgroup_id = Column(Integer, ForeignKey("sub_groups.id",ondelete="CASCADE"), nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id",ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    uploader = relationship("Users", back_populates="resource")
    subgroup = relationship("SubGroup", back_populates="resource")
    file = relationship("Media", foreign_keys=[file_id])
