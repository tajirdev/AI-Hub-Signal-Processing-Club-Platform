from app.core.database import Base
from sqlalchemy import Column,Integer,String,ForeignKey,DateTime,Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func 


class Members(Base):
    __tablename__ = "members"
    id = Column(Integer,primary_key=True,nullable=False)
    user_id = Column(Integer,ForeignKey("users.id",ondelete="CASCADE"))
    subgroup_id = Column(Integer,ForeignKey("sub_groups.id"))
    position = Column(String(150))
    github = Column(String)
    linkedin = Column(String)
    portfolio = Column(String)
    show_profile = Column(Boolean,default=False,nullable=False)
    
    joined_at = Column(DateTime(timezone=True),server_default=func.now())
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())

    user = relationship("Users",back_populates="member")
    subgroup = relationship("SubGroup",back_populates="sub_member")
    research_authors=relationship("ResearchAuthor",back_populates="member", cascade="all, delete-orphan")