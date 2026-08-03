from app.core.database import Base
from sqlalchemy import Column,Integer,String,ForeignKey,DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class SubGroup(Base):
    __tablename__ = "sub_groups"

    id = Column(Integer, primary_key=True)
    name = Column(String(25), unique=True, nullable=False)
    slug =Column(String(100), unique=True, nullable= False)
    description = Column(String(1000))
    icon = Column(String)
    cover_page = Column(String)
    lead_id = Column(Integer,ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now(),nullable=False)
    upadated_at = Column(DateTime(timezone=True),server_default=func.now(), onupdate=func.now(), nullable=False)

    leader =  relationship("Users", back_populates="subgroup")
    sub_member = relationship("Members",back_populates="subgroup")


