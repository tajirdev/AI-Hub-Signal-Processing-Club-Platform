from app.core.database import Base
from sqlalchemy import Column,Integer,ForeignKey
from sqlalchemy.orm import relationship

class UserRole(Base):
    __tablename__ = "userrole"
    id = Column(Integer,primary_key=True)
    user_id = Column(Integer,ForeignKey("users.id"))
    role_id = Column(Integer,ForeignKey("role.id"))

    User = relationship("Users",back_populates="userRole")
    Roles = relationship("Role",back_populates="usersRole")
