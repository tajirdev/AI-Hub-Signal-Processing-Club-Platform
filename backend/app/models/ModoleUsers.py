from app.core.database import Base
from sqlalchemy import Column,String,Integer,Boolean,DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer,primary_key=True)
    first_name = Column(String(10))
    last_name = Column(String(10))
    email = Column(String, unique=True,nullable=False)
    user_name = Column(String(10),nullable=False,unique=True)
    password_hash = Column(String)
    phone = Column(String)
    avatar = Column(String)
    bio = Column(String)
    github_link = Column(String)
    is_active = Column(Boolean,default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(),nullable=False)
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now(),nullable=False)
    
    blog_posts= relationship("BlogPost",back_populates="author",cascade="all, delete-orphan")
    userRole = relationship("UserRole",back_populates="User",cascade="all, delete")
    subgroup = relationship("SubGroup", back_populates="leader",cascade="all, delete")
    member = relationship("Members",back_populates="user",cascade="all, delete")
    event = relationship("Events",back_populates="user",cascade="all, delete")

   
    

