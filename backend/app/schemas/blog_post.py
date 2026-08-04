from pydantic import BaseModel,Field,ConfigDict
from app.models.blog_post import PostStatus
from typing import Optional,List
from datetime import datetime

class  BlogPostCreate(BaseModel):
    title:str=Field(min_length=5,max_length=150)
    excerpt:Optional[str]=None
    content:str=Field(min_length=100)
    featured_image:Optional[str]=None
    status:str=Field(default=PostStatus.draft)

    category_ids:Optional[list[int]]=[]
    
class BlogPostUpdate(BaseModel):
    title:Optional[str]=Field(None,min_length=5,max_length=150)
    excerpt:Optional[str]=None
    content:Optional[str]=Field(None,min_length=100)
    featured_image:Optional[str]=None
    status:Optional[str]=None
    
    category_ids:Optional[list[int]]=None
    
class CategoryResponse(BaseModel):
    id:int
    name:str
    model_config=ConfigDict(from_attributes=True)
        
class BlogPostResponse(BaseModel):
    id:int
    title:str
    slug:str
    excerpt:Optional[str]
    content:str
    featured_image:Optional[str]
    status:str
    published_at:Optional[datetime]
    categories:Optional[list[CategoryResponse]]=[]
    created_at:datetime
    updated_at:datetime
    
    model_config=ConfigDict(from_attributes=True)
        
   