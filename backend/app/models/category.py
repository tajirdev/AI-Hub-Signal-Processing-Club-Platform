from app.core.database import Base
from sqlalchemy import Column,Integer,String,DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class Category(Base):
    __tablename__="categories"
    id=Column(Integer,primary_key=True)
    name=Column(String(100),unique=True,nullable=False)
    created_at=Column(DateTime,default=datetime.now)
    updated_at=Column(DateTime,default=datetime.now,onupdate=datetime.now)
    
    blog_posts=relationship("BlogPost",secondary="blog_categories",back_populates="categories")
    news=relationship("News",back_populates="category")
    events=relationship("Events",back_populates="category")