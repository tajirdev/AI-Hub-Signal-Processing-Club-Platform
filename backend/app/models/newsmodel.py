from app.core.database import Base
from sqlalchemy import Column,Integer,DateTime,String,ForeignKey,Text,Enum
from datetime import datetime
from sqlalchemy.orm import relationship
import enum

class StatusCheck(str,enum.Enum):
    draft="draft",
    published="published"

class News(Base):
    __tablename__="news"
    id=Column(Integer,primary_key=True)
    title=Column(String,nullable=False)
    slug=Column(String,nullable=False)
    summary=Column(Text)
    content=Column(String,nullable=False)
    news_type=Column(String,nullable=True)
    category_id=Column(Integer,ForeignKey("categories.id",ondelete="CASCADE"))
    status=Column(Enum(StatusCheck),default=StatusCheck.published)
    author_id=Column(Integer,ForeignKey("users.id",ondelete="CASCADE"))
    published_at=Column(DateTime)
    created_at=Column(DateTime,default=datetime.now)
    updated_at=Column(DateTime,default=datetime.now(),onupdate=datetime.now())
    
    user=relationship("Users",back_populates="new")
    category=relationship("Category",back_populates="news")