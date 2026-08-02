from pydantic import BaseModel



class SubGroup(BaseModel):
    name : str 
    description : str
    slug : str
    icon : str
    cover_page : str

