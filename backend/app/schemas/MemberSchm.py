from pydantic import BaseModel

class Members(BaseModel):
    position : str
    github : str | None = None
    linkedin : str | None = None
    portfolio : str | None = None



class ShowMembers(BaseModel):
    full_name :str
    sub_group : str
    position : str
    github : str 
    linkedin : str
    portfolio : str 

    class Config:
     from_attributes = True



