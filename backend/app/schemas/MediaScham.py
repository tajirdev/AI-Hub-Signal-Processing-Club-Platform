from pydantic import BaseModel


class Media(BaseModel):
    original_filename : str | None = None
    


    
