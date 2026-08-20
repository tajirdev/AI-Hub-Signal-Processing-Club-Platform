from app.core.database import Base  
from sqlalchemy import Column,Integer,String,Date,ForeignKey,DateTime,Text,Boolean
from datetime import datetime
from sqlalchemy.orm import relationship

class ResearchAuthor(Base):
    __tablename__="research_authors"
    #id=Column(Integer,primary_key=True)
    research_id=Column(Integer,ForeignKey("researchs.id",ondelete="CASCADE"),primary_key=True)
    member_id=Column(Integer,ForeignKey("members.id",ondelete="CASCADE"),primary_key=True)
    author_order=Column(Integer,nullable=False)
    
    research=relationship("Research",back_populates="authors")
    member=relationship("Members",back_populates="research_authors")
    



class Research(Base):
    __tablename__="researchs"
    id=Column(Integer,primary_key=True)
    title=Column(String,nullable=False)
    slug=Column(String,nullable=False)
    abstract=Column(String)
    content=Column(Text)
    publication_date=Column(DateTime,nullable=True)
    pdf_url=Column(String,nullable=True)
    created_by=Column(Integer,ForeignKey("users.id"),nullable=False)
    featured=Column(String)
    created_at=Column(DateTime,default=datetime.now)
    updated_at=Column(DateTime,default=datetime.now,onupdate=datetime.now)
    
    user=relationship("Users",back_populates="research")
    authors=relationship("ResearchAuthor",back_populates="research",cascade="all, delete-orphan",order_by="ResearchAuthor.author_order")
