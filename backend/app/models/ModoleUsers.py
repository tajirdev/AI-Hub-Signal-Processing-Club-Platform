from app.core.database import Base
from sqlalchemy import Column,String,Integer,Boolean,DateTime,ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer,primary_key=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    email = Column(String, unique=True,nullable=False)
    user_name = Column(String(100),nullable=False,unique=True)
    password_hash = Column(String)
    phone = Column(String)
    avatar_id = Column(Integer,ForeignKey("media.id",ondelete="SET NULL"))
    bio = Column(String)
    is_active = Column(Boolean,default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(),nullable=False)
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now(),nullable=False)
    
    blog_posts = relationship("BlogPost", back_populates="author", cascade="all, delete")
    userRole = relationship("UserRole", back_populates="User", cascade="all, delete", lazy="joined")
    subgroup = relationship("SubGroup", back_populates="leader", cascade="all, delete")
    member = relationship("Members", back_populates="user", cascade="all, delete")
    event = relationship("Events", back_populates="user", cascade="all, delete")
    research = relationship("Research", foreign_keys="Research.created_by", back_populates="user", cascade="all, delete")
    media = relationship("Media", foreign_keys="[Media.uploaded_by]", back_populates="user", cascade="all, delete", passive_deletes=True)
    avatar_media = relationship("Media", foreign_keys="[Users.avatar_id]", back_populates="avatar", post_update=True)
    resource = relationship("Resource", back_populates="uploader", cascade="all, delete")
    new = relationship("News", foreign_keys="News.author_id", back_populates="user", cascade="all, delete")
    project = relationship("Project", foreign_keys="Project.created_by", back_populates="creator", cascade="all, delete")

    reviewed_applications = relationship(
        "Application",
        foreign_keys="Application.reviewed_by",
        back_populates="reviewer",
        cascade="all, delete"
    )
    @property
    def roles(self) -> list[str]:
        if self.userRole:
            return [ur.Roles.name for ur in self.userRole if ur.Roles]
        return []

    @property
    def avatar_url(self) -> str | None:
        if self.avatar_media:
            return self.avatar_media.path
        return None

    

