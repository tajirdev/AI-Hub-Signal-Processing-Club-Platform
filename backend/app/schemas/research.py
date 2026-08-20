from pydantic import BaseModel,HttpUrl,ConfigDict,Field
from datetime import date,datetime
from typing import Optional

class ResearchCreate(BaseModel):
    title:str=Field(min_length=5,max_length=150)
    abstract:str=Field(min_length=30,max_length=100)
    content:str
    pdf_url:HttpUrl |None=None
    featured:bool=False
    publication_date:datetime |None=None
    author_ids:list[int]
    
    model_config=ConfigDict(from_attributes=True) 
    
class Researchupdate(BaseModel):
    title:Optional[str]=None
    abstract:str | None
    content:str | None
    pdf_url:Optional[HttpUrl]=None
    publication_date:datetime |None=None
    author_ids:list[int] | None
    featured:bool

    model_config=ConfigDict(from_attributes=True) 
    
class ResearchAuthorResponse(BaseModel):
    member_id:int
    author_order:int
    model_config=ConfigDict(from_attributes=True)

class ResearchResponse(BaseModel):
    id:int
    title:str
    slug:str
    publication_date:datetime |None
    abstract:str
    content:str
    pdf_url:Optional[HttpUrl]=None
    featured:bool
    created_by:int
    created_at:datetime
    updated_at:datetime
    
    authors:list[ResearchAuthorResponse]=[]
    
    model_config=ConfigDict(from_attributes=True)    
