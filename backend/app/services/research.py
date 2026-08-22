from app.schemas.research import ResearchCreate,Researchupdate
from sqlalchemy.orm import Session
from app.models.research import Research,ResearchAuthor
from app.models.ModoleUsers import Users
from app.models.ModoleMembers import Members
from fastapi import HTTPException,status
from app.models.ModoleRoles import Role
from sqlalchemy import or_,asc,desc
import math
from app.models.media import Media
from app.services.storage.local import delete_upload_file
from app.services.storage.local import delete_upload_file
from app.models.media import Media

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
        roles = current_user.roles
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
        roles = current_user.roles
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
        roles = current_user.roles
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
        if data.title is not None:
            research.title=data.title
            research.slug=ResearchServices.generate_slug(data.title,db)
        if data.abstract is not None:
            research.abstract=data.abstract
        if data.content is not None:
            research.content=data.content
        if data.file_id is not None:
            research.file_id=data.file_id
        
       
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
        roles = current_user.roles
              
        if "super_admin" in roles:
           pass
                    
        elif "editor" in roles:
            if(research.created_by != current_user.id):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="you not  have action to perform this")
            
        if research.file_id:
            media_record = db.query(Media).filter(Media.id == research.file_id).first()
            if media_record:
                delete_upload_file(media_record.path)
                db.delete(media_record)

        db.delete(research)
        db.commit()
        
        return {
            "message":"research delete succesful"
        }


class ResearchMediaService:
    @staticmethod
    def CreateFile(research_id: int, path: str, mime_type: str, original_filename: str, db: Session, current_user_id: int):
        research = db.query(Research).filter(Research.id == research_id).first()
        if not research:
            raise HTTPException(status_code=404, detail="Research not found")
            
        user = db.query(Users).filter(Users.id == current_user_id).first()
        if research.created_by != current_user_id and "super_admin" not in user.roles:
            raise HTTPException(status_code=403, detail="Not authorized")
            
        media_record = db.query(Media).filter(Media.id == research.file_id).first()
        
        if media_record:
            delete_upload_file(media_record.path)
            media_record.path = path
            media_record.filename = path
            media_record.mime_type = mime_type
            media_record.original_filename = original_filename
        else:
            media_record = Media(
                filename=path,
                path=path,
                original_filename=original_filename,
                uploaded_by=current_user_id,
                mime_type=mime_type
            )
            db.add(media_record)
            db.flush()
            
        research.file_id = media_record.id
        db.commit()
        db.refresh(media_record)
        return media_record
        
    @staticmethod
    def RemoveFile(research_id: int, db: Session, current_user_id: int):
        research = db.query(Research).filter(Research.id == research_id).first()
        if not research:
            raise HTTPException(status_code=404, detail="Research not found")
            
        user = db.query(Users).filter(Users.id == current_user_id).first()
        if research.created_by != current_user_id and "super_admin" not in user.roles:
            raise HTTPException(status_code=403, detail="Not authorized")
            
        media_record = db.query(Media).filter(Media.id == research.file_id).first()
        if not media_record:
            raise HTTPException(status_code=404, detail="No file found for this research")
            
        delete_upload_file(media_record.path)
        research.file_id = None
        db.delete(media_record)
        db.commit()
        return {"message": "File deleted successfully"}

