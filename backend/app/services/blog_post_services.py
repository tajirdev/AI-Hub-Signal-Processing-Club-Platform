from sqlalchemy.orm import Session
from fastapi import HTTPException,status
from app.schemas.blog_post import BlogPostCreate,BlogPostUpdate
from app.models.blog_post import BlogPost,PostStatus
from app.models.category import Category
from datetime import datetime
from sqlalchemy import or_,asc,desc


class BlogPostService:
    def __init__(self):
        pass


    #create slug from title
    def generate_slug(self,title:str,db:Session):
        base_slug=title.lower().replace(" ","-")
        slug=base_slug
        counter=1
        while db.query(BlogPost).filter(BlogPost.slug==slug).first():
            slug=f"{base_slug}-{counter}"
            counter+=1
        return slug    

    def blog_post_create(self,data:BlogPostCreate,current_user,db:Session):
        
        slug=self.generate_slug(data.title,db)
        categories=[]
        if data.category_ids:
            categories=db.query(Category).filter(Category.id.in_(data.category_ids)).all()
            if len(categories) != len(data.category_ids):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Category not found")
            
        posts=BlogPost(
            title=data.title,
            slug=slug,
            content=data.content,
            excerpt=data.excerpt,
            featured_image=data.featured_image,
            status=data.status,
            author_id=current_user.id,
            categories=categories
        )
        if data.status == PostStatus.published:
            posts.published_at=datetime.now()
            
        db.add(posts)    
        db.commit()
        db.refresh(posts)
        
        return posts
        
    def get_all_blog_post(self,current_user,db:Session,
                        page:int=1,search:str=None,
                        limit:int=10,
                        category_id:int=None,
                        status:str=None,
                        sort:str="published_at",order:str="desc"):
        roles=[ur.Roles.name for ur in current_user.userRole]
        post =db.query(BlogPost)
        if "super_admin" in roles:
            pass
        
        elif "editor" in roles:
            post=post.filter((BlogPost.status==PostStatus.published)|(BlogPost.author_id==current_user.id)) 
            
        elif "member" in roles:
            post=post.filter(BlogPost.status==PostStatus.published)
            
        
        #search
        if search:
            post=post.filter(or_(
                BlogPost.title.ilike(f"%{search}%"),
                BlogPost.excerpt.ilike(f"%{search}%"),
                BlogPost.content.ilike(f"%{search}%")
            ))      
        if status:
            post=post.filter(BlogPost.status==status) 
        if category_id:
            post=post.join(BlogPost.categories).filter(Category.id==category_id)     
        if sort=="title":
            if order=="asc":
                post=post.order_by(asc(BlogPost.title))
            else:
                post=post.order_by(desc(BlogPost.title))    
        else:
            if order =="asc":
                post=post.order_by(asc(BlogPost.published_at))
            else:
                post=post.order_by(desc(BlogPost.published_at)) 
                                
        skip = (page - 1)* limit        
        posts=post.offset(skip).limit(limit).all()
        return posts


    def get_blog_post_by_id(self,post_id:int,current_user,db:Session):
        roles=[ur.Roles.name for ur in current_user.userRole]
        post=db.query(BlogPost).filter(BlogPost.id==post_id).first()
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="blog post not found")
        if "super_admin" in roles:
            pass
            
        elif "editor" in roles:
            if(post.status != PostStatus.published and post.author_id != current_user.id):
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="blog post not found")
        
        elif "member" in roles:
            if post.status != PostStatus.published:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="blog post not found")    
            
        return post    

    def update_blog_post(self,post_id:int,data:BlogPostUpdate,current_user,db:Session):
        roles=[ur.Roles.name for ur in current_user.userRole]
        post=db.query(BlogPost).filter(BlogPost.id==post_id).first()
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="blog post not found")
        if (post.author_id !=current_user.id and "super_admin" not in roles):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="you cannot update this post")
        
        if data.title:
            post.title=data.title
            post.slug=generate_slug(data.title,db)
        if data.content:
            post.content=data.content    
        if data.excerpt:
            post.excerpt=data.excerpt     
        if data.featured_image:
            post.featured_image=data.featured_image
        if (data.status == PostStatus.published and post.status!=PostStatus.published):
            post.published_at=datetime.now()
        if data.status:
            if data.status not in [s.value for s in PostStatus]:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=f"invalid status.must be one of:{[s.value for s in PostStatus]}")
            post.status=data.status
            
        if data.category_ids:
            categories=db.query(Category).filter(Category.id.in_(data.category_ids)).all()
            if len(categories) != len(data.category_ids):
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Category not found")
                    
            post.categories=categories    
            
        db.commit()        
        db.refresh(post)
        
        return post

    def delete_blog_post(self,post_id:int,current_user,db:Session):
        roles=[ur.Roles.name for ur in current_user.userRole]
        post=db.query(BlogPost).filter(BlogPost.id==post_id).first()
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="blog post not found")
        if (post.author_id !=current_user.id and "super_admin" not in roles):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="you cannot update this post")  
        
        db.delete(post)
        db.commit()          
        
        return{"message":"blog post deleted succesfully"}