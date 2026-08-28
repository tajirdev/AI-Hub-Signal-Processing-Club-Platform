from app.core.database import Base
from sqlalchemy import Column,Integer,String,ForeignKey,DateTime,Date,Text,Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum



class EventStatus(str, enum.Enum):
    published = "published"
    draft = "draft"


class Events(Base):
    __tablename__ = "events"

    id= Column(Integer,primary_key=True,nullable=False)
    title = Column(String(100),nullable=False)
    description = Column(Text,nullable=False)
    location = Column(String)
    event_date = Column(Date,nullable=False,index=True)
    registration_link = Column(String(225))
    cover_image_id= Column(Integer,ForeignKey("media.id",ondelete="SET NULL"))
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    status = Column(Enum(EventStatus),default=EventStatus.draft,nullable=False,index=True)
    created_by = Column(Integer,ForeignKey("users.id",ondelete="CASCADE"),index=True)
    created_at = Column(DateTime(timezone=True),server_default=func.now(),nullable=False)
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now(),nullable=False)
    published_at = Column(DateTime(timezone=True),server_default=func.now())



    user = relationship("Users",back_populates="event")
    cover = relationship("Media",foreign_keys="[Events.cover_image_id]",back_populates="event")
    category = relationship("Category", back_populates="events")

