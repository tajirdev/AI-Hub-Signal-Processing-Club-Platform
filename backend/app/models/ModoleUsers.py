from app.core.database import Base
from sqlalchemy import Column,String,Integer,Boolean
from sqlalchemy.orm import relationship

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
    is_active = Column(Boolean)
    created_at = Column(String)
    updated_at = Column(String)

    userRole = relationship(" Users",back_populates="User")
    

