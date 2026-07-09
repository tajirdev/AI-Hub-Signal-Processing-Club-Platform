from app.core.database import Base
from sqlalchemy import Column,Integer,String
from sqlalchemy.orm import relationship

class Role(Base):
    __tablename__ = "role"
    id = Column(Integer,primary_key=True)
    name = Column(String)
    description = Column(String)

    usersRole = relationship("UserRole",back_populates="Roles")
