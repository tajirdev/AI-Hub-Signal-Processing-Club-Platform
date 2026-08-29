
from pydantic import BaseModel,Field,ConfigDict
from typing import Optional,List
from datetime import datetime

class CategoryCreate(BaseModel):
    name:str
     
class CategoryUpdate(BaseModel): 
    name:str
    
class CategoryResponse(BaseModel):
    id:int
    name:str
    created_at:Optional[datetime]=None
    updated_at:Optional[datetime]=None
    
    model_config=ConfigDict(from_attributes=True)