from app.core.database import Base
from sqlalchemy import Column,Integer,String,ForeignKey,DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class Media(Base):
    __tablename__ = "media"
    id = Column(Integer,primary_key=True)
    filename = Column(String(225),nullable=False,unique=True)
    original_filename = Column(String(150),nullable=False)
    path = Column(String,nullable=False)
    mime_type = Column(String)
    size = Column(Integer,nullable=False)
    uploaded_by = Column(Integer,ForeignKey("users.id",ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True),server_default=func.now())

   

    user = relationship("Users", foreign_keys="[Media.uploaded_by]", back_populates="media")
    
   
    avatar = relationship("Users", foreign_keys="[Users.avatar_id]", back_populates="avatar_media")



