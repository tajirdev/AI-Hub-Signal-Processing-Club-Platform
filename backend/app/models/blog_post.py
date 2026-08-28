from app.core.database import Base
from sqlalchemy import Column,Integer,String,DateTime,ForeignKey,Text,Enum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

class PostStatus(str,enum.Enum):
    draft="draft"
    published="published"

class BlogCategory(Base):
    __tablename__="blog_categories"
    
    blog_id=Column(Integer,ForeignKey("blog_posts.id",ondelete="CASCADE"),primary_key=True)
    Category_id=Column(Integer,ForeignKey("categories.id",ondelete="CASCADE"),primary_key=True)
    
    
class BlogPost(Base):
    __tablename__="blog_posts"
    
    id=Column(Integer,primary_key=True)
    title=Column(String(150),nullable=False)
    slug=Column(String(180),nullable=False,unique=True)
    excerpt=Column(String(500),nullable=True,index=True)
    content=Column(Text,nullable=True)
    featured_image_id=Column(Integer,ForeignKey("media.id",ondelete="SET NULL"),nullable=True)
    status=Column(Enum(PostStatus),default=PostStatus.draft)
    published_at=Column(DateTime,default=datetime.now)
    author_id=Column(Integer,ForeignKey("users.id",ondelete="CASCADE"),nullable=False)
    created_at=Column(DateTime,default=datetime.now)
    updated_at=Column(DateTime,default=datetime.now,onupdate=datetime.now)
    
    author=relationship("Users",back_populates="blog_posts")
    media=relationship("Media",back_populates="blog")
    categories=relationship("Category",secondary="blog_categories",back_populates="blog_posts")
    #media=relationship("Media",foreign_keys="media.path",back_populates="media")