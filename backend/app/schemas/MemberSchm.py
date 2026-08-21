from pydantic import BaseModel
from typing import Optional

class Members(BaseModel):
    position : str
    github : Optional[str] = None
    linkedin : Optional[str] = None
    portfolio : Optional[str] = None
    user_id : Optional[int] = None



class ShowMembers(BaseModel):
    full_name :str
    sub_group : str
    position : str
    github : str 
    linkedin : str
    portfolio : str 

    class Config:
     from_attributes = True



