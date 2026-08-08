from pydantic import BaseModel


class AvatarResponse(BaseModel):
    original_filename : str 
    path : str
    


    
