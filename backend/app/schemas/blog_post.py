from pydantic import BaseModel,Field,ConfigDict
from app.models.blog_post import PostStatus
from typing import Optional,List
from datetime import datetime
from app.schemas.category import CategoryResponse

class  BlogPostCreate(BaseModel):
    title:str=Field(min_length=5,max_length=150)
    excerpt:Optional[str]=None
    content:str=Field(min_length=100)
    status:str=Field(default=PostStatus.draft)

    category_ids:Optional[list[int]]=[]
    
class BlogPostUpdate(BaseModel):
    title:Optional[str]=Field(None,min_length=5,max_length=150)
    excerpt:Optional[str]=None
    content:Optional[str]=Field(None,min_length=100)
    status:Optional[str]=None
    
    category_ids:Optional[list[int]]=None
 
        

class MediaResponse(BaseModel):
    id: int
    path: str
    
    model_config = ConfigDict(from_attributes=True)

class UserPreview(BaseModel):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    user_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    model_config=ConfigDict(from_attributes=True)

class BlogPostResponse(BaseModel):
    id:int
    author:Optional[UserPreview]=None
    title:str
    slug:str
    excerpt:Optional[str]
    content:str
    featured_image_id:Optional[int]
    media:Optional[MediaResponse]=None
    status:str
    published_at:Optional[datetime]
    categories:Optional[list[CategoryResponse]]=[]
    created_at:datetime
    updated_at:datetime
    
    model_config=ConfigDict(from_attributes=True)
        
class PaginationResponse(BaseModel):
       page:int
       limit:int
       total:int
       total_pages:int
       posts:List[BlogPostResponse]
       
       model_config=ConfigDict(from_attributes=True)