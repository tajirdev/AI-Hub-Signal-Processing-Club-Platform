from app.core.database import Base
from sqlalchemy import Column,Integer,String,ForeignKey,DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class SubGroup(Base):
    __tablename__ = "sub_groups"

    id = Column(Integer, primary_key=True)
    name = Column(String(150), unique=True, nullable=False)
    slug = Column(String(150), unique=True, nullable=False)
    description = Column(String(1000))
    icon_id = Column(Integer,ForeignKey("media.id",ondelete="CASCADE"))
    cover_page_id = Column(Integer,ForeignKey("media.id",ondelete="CASCADE"))
    lead_id = Column(Integer,ForeignKey("users.id",ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now(),nullable=False)
    upadated_at = Column(DateTime(timezone=True),server_default=func.now(), onupdate=func.now(), nullable=False)

    leader = relationship("Users", back_populates="subgroup")
    resource = relationship("Resource", back_populates="subgroup")
    sub_member = relationship("Members", back_populates="subgroup")

    Sub_icon = relationship("Media", foreign_keys="[SubGroup.icon_id]", back_populates="Icon")
    sub_cover = relationship("Media", foreign_keys="[SubGroup.cover_page_id]", back_populates="cover")

    @property
    def icon_url(self) -> str | None:
        if self.Sub_icon:
            return self.Sub_icon.filename or self.Sub_icon.path
        return None

    @property
    def cover_image_url(self) -> str | None:
        if self.sub_cover:
            return self.sub_cover.filename or self.sub_cover.path
        return None



