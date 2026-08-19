from app.schemas.news import NewsCreate,NewsUpdate
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.category import Category
from app.models.newsmodel import News,StatusCheck
from fastapi import HTTPException,status,Query
from sqlalchemy import or_,desc,asc
import math

def generate_slug(title:str,db:Session):
    base_slug=title.lower().replace(" ","-")
    slug=base_slug
    count=1
    while db.query(News).filter(News.slug==slug).first():
        slug=f"{base_slug}-{count}"
        count += 1
    return slug    


def new_create(data:NewsCreate,current_user,db:Session):
    
    category=db.query(Category).filter(Category.id == data.category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="category not found")    
    published_at=None
    if data.status==StatusCheck.published:
        published_at=datetime.now()
    new=News(
        title=data.title,
        summary=data.summary,
        content=data.content,
        news_type=data.news_type,
        status=data.status,
        published_at=published_at,
        slug=generate_slug(data.title,db),
        category_id=data.category_id,
        author_id=current_user.id
    )
    
    db.add(new)    
    db.commit()
    db.refresh(new)
    return new

def get_all_news(db:Session,
                 page:int=Query(1,ge=1),
                 limit:int=Query(10,ge=10,le=100),
                 search:str=None,sort:str="desc",order:str=None
                 
                 ):
    
    news=db.query(News).filter(News.status==StatusCheck.published)
    if not news:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="news not  yet published")
    if search:
        news=news.filter(or_(
            News.title.ilike(f"%{search}%"),
            News.content.ilike(f"%{search}%"),
            News.summary.ilike("%{search}%")
        ))
    
    if sort=="title":
        if order=="asc":
            news.order_by(asc(news.title))
        else:
            news.order_by(desc(news.title))  
    elif sort=="published_at":
        if order=="asc":
            news=news.order_by(asc(News.created_at))
        else:
            news=news.order_by(desc(News.created_at))
    else:
        news=news.order_by(asc(News.published_at))    
    
    skip=(page-1)*limit
    total=news.count()
    total_pages=math.ceil(total / limit)
    news=news.offset(skip).limit(limit).all()              
            
    return{
        "page":page,
        "limit":limit,
        "total":total,
        "total_pages":total_pages,
        "news":news
        
    }

  

def get_news_id(news_id:int,db:Session):
    news=db.query(News).filter(News.id==news_id).first()
    if not news:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="news not found")
    if news.status != StatusCheck.published:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="news not yet published")
    
    return news

def update_news(news_id:int,data:NewsUpdate,current_user,db:Session):
    roles=[ur.Roles.name for ur in current_user.userRole]
    category=db.query(Category).filter(Category.id == data.category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="category not found")
    news=db.query(News).filter(News.id==news_id).first()
    if not news:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="news not found")
    if (news.author_id != current_user.id and "super_admin" not in roles):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="you cannot perform this action")
    
    if data.title:
        news.title=data.title
        news.slug=generate_slug(data.title,db)
    if data.category_id:
        news.category_id=data.category_id        
    if data.content:
        news.content=data.content 
    if data.summary:
        news.summary=data.summary
    if data.status:
        news.status=data.status
        if data.status == StatusCheck.published:
            news.published_at=datetime.now()
        else:
            news.published_at=None     

    
    db.commit()            
    db.refresh(news)
    
    return news

def delete_news(news_id:int,current_user,db:Session):
    roles=[ur.Roles.name for ur in current_user.userRole]
    news=db.query(News).filter(News.id==news_id).first()
    if not news:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="not found")
    if "super_admin" not in roles and news.author_id != current_user.id:
        raise HTTPException(status_code =status.HTTP_403_FORBIDDEN,detail="you cannot perform this action")
        
    db.delete(news)
    db.commit()
    
    return {
        "message":"news daleted succesfuly"
    }
    