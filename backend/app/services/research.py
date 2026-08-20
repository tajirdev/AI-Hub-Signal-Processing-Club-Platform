from app.schemas.research import ResearchCreate,Researchupdate
from sqlalchemy.orm import Session
from app.models.research import Research,ResearchAuthor
from app.models.ModoleMembers import Members
from fastapi import HTTPException,status
from app.models.ModoleRoles import Role
from sqlalchemy import or_,asc,desc
import math

class ResearchServices(): 
    
    @staticmethod
    def generate_slug(title:str,db:Session):
        base_slug=title.lower().replace(" ","-")
        slug=base_slug
        counter=1
        while db.query(Research).filter(Research.slug==slug).first():
            slug=f"{base_slug}-{counter}"
            counter+=1
        return slug
        
    @staticmethod
    def addresearch(data:ResearchCreate,db:Session,current_user):
        authors=[]
        if data.author_ids:
            member=db.query(Members).filter(Members.id.in_(data.author_ids)).all()
            if len(member) != len(data.author_ids):
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=" the Authors member  not found")
            
        research=Research(
            title=data.title,
            slug=ResearchServices.generate_slug(data.title,db),
            abstract=data.abstract,
            content=data.content,
            pdf_url=str(data.pdf_url),
            featured=data.featured,
            created_by=current_user.id
          
        )
        db.add(research)
        db.flush()
        for order,member_id in enumerate(data.author_ids,start=1):
            author=ResearchAuthor(
                research_id=research.id,
                member_id=member_id,
                author_order=order
            )
            db.add(author)
        
        db.commit()
        db.refresh(research)
        
        return research
    
    @staticmethod
    def show_all(db:Session,current_user,
                 page:int=1,search:str=None,
                 limit:int=10,title:str=None,
                 sort:str="publication_date",
                 order:str="desc"):
        roles=[ur.Roles.name for ur in current_user.userRole]
        research=db.query(Research)
        if "super_admin" in roles:
            pass
          
        elif "editor" in roles:
            research=research.filter((Research.publication_date != None)|(Research.created_by==current_user.id)) 
                    
        elif "member" in roles:
            research=research.filter(Research.publication_date != None)
        if search:
            research=research.filter(or_(
                Research.title.ilike(f"%{search}"),
                Research.abstract.ilike(f"%{search}"),
                Research.content.ilike(f"%{search}")
                
            )) 
        if sort=="title":
            if order=="asc":
                research=research.order_by(asc(Research.title))
            else:
                research=research.order_by(desc(Research.title))    
        else:
            if order =="asc":
                research=research.order_by(asc(Research.publication_date))
            else:
                research=research.order_by(desc(Research.publication_date)) 
                            
        skip = (page - 1)* limit 
        researchs=research.offset(skip).limit(limit).all()
        
        return researchs
    
    @staticmethod
    def show_by_id(research_id:int,db:Session,current_user):
        research=db.query(Research).filter(Research.id==research_id).first()
        if not research:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"research not found")
        roles=[ur.Roles.name for ur in current_user.userRole]
        if "super_admin" in roles:
            pass
        elif "editor" in roles:
            if(research.publication_date == None and research.created_by != current_user.id):
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="research not found")
        elif "member" in roles:
            if (research.publication_date ==None):
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="research not found")
                    
        return research
    
    @staticmethod
    def update(research_id:int,data:Researchupdate,db:Session,current_user):
        research =db.query(Research).filter(Research.id==research_id).first()
        roles=[ur.Roles.name for ur in current_user.userRole]
        if not research:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="research not found")
        if "super_admin" in roles:
            research.featured=data.featured
            
        elif "editor" in roles:
            if(research.created_by != current_user.id):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="you not  have action to perform this")
        if data.author_ids is not None:
            member=db.query(Members).filter(Members.id.in_(data.author_ids)).all()
            if len(member) != len(data.author_ids):
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="One or  more authors  not found")
            research.authors.clear()
        if data.title:
            research.title=data.title
            research.slug=ResearchServices.generate_slug(data.title,db)
        if data.abstract:
            research.abstract=data.abstract
        if data.content:
            research.content=data.content
        if data.pdf_url:
            research.pdf_url=str(data.pdf_url)
        
       
        if data.author_ids is not None:
            for order,member_id in enumerate(data.author_ids,start=1):
                author=ResearchAuthor(
                    member_id=member_id,
                    author_order=order
                )
                research.authors.append(author)  
          
        db.commit()
        db.refresh(research)
        
        return research
    
    @staticmethod
    def deleteresource(research_id,db:Session,current_user):
        research=db.query(Research).filter(Research.id==research_id).first()
        if not research:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="research not found")
        roles=[ur.Roles.name for ur in current_user.userRole]
              
        if "super_admin" in roles:
           pass
                    
        elif "editor" in roles:
            if(research.created_by != current_user.id):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="you not  have action to perform this")
            
        db.delete(research)
        db.commit()
        
        return {
            "message":"research delete succesful"
        }