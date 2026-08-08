import re
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class ResearchAuthor(Base):
    __tablename__ = "research_authors"

    research_id = Column(Integer, ForeignKey("research.id", ondelete="CASCADE"), primary_key=True)
    member_id = Column(Integer, ForeignKey("members.id", ondelete="CASCADE"), primary_key=True)
    author_order = Column(Integer, nullable=False)

    research = relationship("Research", back_populates="authors_assoc")
    member = relationship("Members")


class Research(Base):
    __tablename__ = "research"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    abstract = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    publication_date = Column(DateTime, nullable=True)
    pdf_url = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    featured = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    creator = relationship("Users")
    authors_assoc = relationship(
        "ResearchAuthor",
        back_populates="research",
        cascade="all, delete-orphan",
        order_by="ResearchAuthor.author_order"
    )