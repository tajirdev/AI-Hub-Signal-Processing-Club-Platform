from pydantic import BaseModel,EmailStr
from datetime import datetime

class Application(BaseModel):
    first_name : str
    last_name:str
    registration_number : int
    programme : str  
    year: int
    email : EmailStr
    phone: int
    motivation:str | None=None

class ApplicationResponce(BaseModel):
    id:int
    first_name : str
    last_name:str
    registration_number : int
    programme : str  
    year: int
    email : EmailStr
    phone: int
    motivation:str  | None=None
    created_at:datetime
    status:str
    reviewed_by:int | None=None

    class Config:
      from_attributes = True

class Applicationedite(BaseModel):
   status:str

