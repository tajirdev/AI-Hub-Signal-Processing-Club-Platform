from fastapi import APIRouter,Depends,status
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.ModoleUsers import Users
from app.core.RoleAuth import RoleChecker
from app.schemas.blog_post import BlogPostCreate,BlogPostUpdate,BlogPostResponse
from app.services.blog_post_services import blog_post_create,get_all_blog_post,get_blog_post_by_id,delete_blog_post,update_blog_post

editor_required = RoleChecker(["editor","super_admin"])

member_required = RoleChecker(["member", "editor", "super_admin"])

router= APIRouter(
    prefix="/blog-posts",
    tags=["Blog Post"]
)

@router.post("",response_model=BlogPostResponse)
def create_blog_post(data:BlogPostCreate,current_user:Users=Depends(editor_required),db:Session=Depends(get_db)):
    return blog_post_create(data,current_user,db)


@router.get("",response_model=list[BlogPostResponse])
def get_blog(
    page:int=1,search:str=None,
    limit:int=10,category_id:int=None,
    status:str=None,sort:str="published_at",
    order:str="desc",
    current_user:Users=Depends(member_required),db:Session=Depends(get_db)):
    
    return get_all_blog_post(current_user,db,page,search,limit,category_id,status,sort,order)

@router.get("/{post_id}",response_model=BlogPostResponse)
def get_blog_post(post_id:int,current_user:Users=Depends(member_required),db:Session=Depends(get_db)):
    return get_blog_post_by_id(post_id,current_user,db)

@router.put("/{post_id}",response_model=BlogPostResponse)
def create_blog_post(post_id:int,data:BlogPostUpdate,current_user:Users=Depends(editor_required),db:Session=Depends(get_db)):
    return update_blog_post(post_id,data,current_user,db)


@router.delete("/{post_id}")
def delete_post(post_id:int,current_user:Users=Depends(editor_required),db:Session=Depends(get_db)):
    return delete_blog_post(post_id,current_user,db)