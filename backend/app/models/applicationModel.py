import enum

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Enum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class ApplicationStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class Application(Base):
    __tablename__ = "applications"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        nullable=False
    )

    first_name = Column(
        String(50),
        nullable=False
    )

    last_name = Column(
        String(50),
        nullable=False
    )

    registration_number = Column(
        Integer,
        nullable=False,
        unique=True,
        index=True
    )

    programme = Column(
        String(150),
        nullable=False
    )

    year = Column(
        Integer,
        nullable=False
    )

    email = Column(
        String(255),
        nullable=False,
        index=True
    )

    phone = Column(
        String(20),
        nullable=False
    )

    motivation = Column(
        String,
        nullable=True
    )

    status = Column(
        Enum(ApplicationStatus),
        default=ApplicationStatus.pending,
        nullable=False
    )

    reviewed_by = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="SET NULL"
        ),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    reviewer = relationship(
        "Users",
        foreign_keys=[reviewed_by],
        back_populates="reviewed_applications"
    )