from fastapi import APIRouter,Depends,status,File,UploadFile
from typing import List
from pathlib import Path
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.ModoleUsers import Users
from app.core.RoleAuth import RoleChecker
from app.schemas.blog_post import BlogPostCreate,BlogPostUpdate,BlogPostResponse
from app.services.blog_post_services import BlogPostService
from app.services.storage.local import save_upload_file,UploadCategory,IMAGE_TYPES

services = BlogPostService()

editor_required = RoleChecker(["editor","super_admin"])

member_required = RoleChecker(["member", "editor", "super_admin"])

router= APIRouter(
    prefix="/blog-posts"
    
)

@router.post("",tags=["Blog Post"],response_model=BlogPostResponse)
def create_blog_post(data:BlogPostCreate,current_user:Users=Depends(editor_required),db:Session=Depends(get_db)):
    return services.blog_post_create(data,current_user,db)


@router.get("",tags=["Blog Post"],response_model=list[BlogPostResponse])
def get_blog(
    page:int=1,search:str=None,
    limit:int=10,category_id:int=None,
    status:str=None,sort:str="published_at",
    order:str="desc",
    current_user:Users=Depends(member_required),db:Session=Depends(get_db)):
    
    return services.get_all_blog_post(current_user,db,page,search,limit,category_id,status,sort,order)

@router.get("/{post_id}",tags=["Blog Post"],response_model=BlogPostResponse)
def get_blog_post(post_id:int,current_user:Users=Depends(member_required),db:Session=Depends(get_db)):
    return services.get_blog_post_by_id(post_id,current_user,db)

@router.put("/{post_id}",tags=["Blog Post"],response_model=BlogPostResponse)
def update_post(post_id:int,data:BlogPostUpdate,current_user:Users=Depends(editor_required),db:Session=Depends(get_db)):
    return services.update_blog_post(post_id,data,current_user,db)


@router.delete("/{post_id}",tags=["Blog Post"])
def delete_post(post_id:int,current_user:Users=Depends(editor_required),db:Session=Depends(get_db)):
    return services.delete_blog_post(post_id,current_user,db)

@router.post("/{post_id}",tags=["Blog Post cover"])
def uploadpost(
    post_id:int,
    db:Session=Depends(get_db),
    current_user:Users=Depends(editor_required),
    file:UploadFile=File(...)
):
    file_path=save_upload_file(
        file=file,
        allowed_types=IMAGE_TYPES,
        category=UploadCategory.BLOG_COVERS,
    )
    post = services.createfeaturedimage(
        post_id=post_id,
        db=db,
        path=file_path,
        original_filename=file.filename,
        current_user=current_user,
        mime_type=file.content_type,
        filename=Path(file_path).name
    )
    return post

@router.get("/{post_id}/cover",tags=["Blog Post cover"])   
def getpostcover(post_id:int,
             db:Session=Depends(get_db),
             current_user:Users=Depends(member_required)):
    return services.getblogcover(post_id,db)        

@router.delete("/{post_id}/cover",tags=["Blog Post cover"])   
def removepostcover(post_id:int,
                    db:Session=Depends(get_db),
                    current_user:Users=Depends(editor_required)):
    return services.removeblogCover(post_id,current_user,db)        
