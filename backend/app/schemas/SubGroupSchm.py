from pydantic import BaseModel,Field



class SubGroup(BaseModel):
    name : str =Field(max_length=150)
    description : str = Field(min_length=30)
    icon : str
    cover_page : str

