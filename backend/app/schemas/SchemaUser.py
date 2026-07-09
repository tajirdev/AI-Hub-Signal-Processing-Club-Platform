from pydantic import BaseModel,EmailStr

class Users(BaseModel):
    first_name : str
    last_name : str
    user_name : str
    email : EmailStr
    password_hash: str
    phone : str
    avatar : str
    bio : str
    github_link : str
   

