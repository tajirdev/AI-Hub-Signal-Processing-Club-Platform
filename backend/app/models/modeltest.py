from app.core.database import Base
from sqlalchemy import Column,Integer,String


class Test(Base):
  
    __tablename__ = "test"

    id = Column(Integer,primary_key=True)
    name = Column(String)
    test = Column(String)

    