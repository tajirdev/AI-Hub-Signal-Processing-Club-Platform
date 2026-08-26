from app.core.database import Base
from sqlalchemy import Column,String,Integer,DateTime
from sqlalchemy.sql import func 

class Contact(Base):
 __tablename__ = "contact"
 id = Column(Integer,primary_key=True)
 name = Column(String(30))
 email= Column(String(255)) 
 subject = Column(String) 
 message = Column(String)
 status = Column(String,default="pending") 
 created_at = Column(DateTime(timezone=True),server_default=func.now()) 