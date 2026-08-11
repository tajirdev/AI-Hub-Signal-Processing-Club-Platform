import re
from datetime import datetime
from typing import List, Optional
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.core.database import Base
from app.models.ModoleUsers import Users
from app.models.ModoleMembers import Members

class ResearchAuthor(Base):
    """Join table associating Research entries ."""
    __tablename__ = "research_authors"

    research_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("research.id", ondelete="CASCADE"), primary_key=True
    )
    member_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("members.id", ondelete="CASCADE"), primary_key=True
    )
    author_order: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relationships
    research: Mapped["Research"] = relationship("Research", back_populates="authors")
    member: Mapped["Members"] = relationship("Members")


class Research(Base):
    """Database model for club Research publications."""
    __tablename__ = "research"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    abstract: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    publication_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True, index=True)
    pdf_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    creator: Mapped["Users"] = relationship("Users")
    authors: Mapped[List["ResearchAuthor"]] = relationship(
        "ResearchAuthor",
        back_populates="research",
        order_by="ResearchAuthor.author_order",
        cascade="all, delete-orphan",
    )