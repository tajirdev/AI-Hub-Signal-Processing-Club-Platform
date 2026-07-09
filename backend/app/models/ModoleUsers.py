from app.core.database import Base
from sqlalchemy import Column,String,Integer,Boolean,DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer,primary_key=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String)
    password_hash = Column(String)
    phone = Column(String)
    avatar = Column(String)
    bio = Column(String)
    github_link = Column(String)
    is_active = Column(Boolean,default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    

    userRole = relationship("UserRole",back_populates="User")
    

