from app.schemas.research import ResearchCreate, Researchupdate
from sqlalchemy.orm import Session, joinedload
from app.models.research import Research, ResearchAuthor
from app.models.ModoleUsers import Users
from app.models.ModoleMembers import Members
from fastapi import HTTPException, status
from app.models.ModoleRoles import Role
from sqlalchemy import or_, asc, desc
from datetime import datetime
import math
from app.models.media import Media
from app.services.storage.local import delete_upload_file

class ResearchServices:
    @staticmethod
    def generate_slug(title: str, db: Session):
        base_slug = title.lower().replace(" ", "-")
        slug = base_slug
        counter = 1
        while db.query(Research).filter(Research.slug == slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug
        
    @staticmethod
    def addresearch(data: ResearchCreate, db: Session, current_user):
        if data.author_ids:
            member = db.query(Members).filter(Members.id.in_(data.author_ids)).all()
            if len(member) != len(data.author_ids):
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="One or more author members not found")

        pub_date = data.publication_date
        is_pub = data.is_published
        if is_pub and pub_date is None:
            pub_date = datetime.now()
        elif pub_date is not None:
            is_pub = True

        research = Research(
            title=data.title,
            slug=ResearchServices.generate_slug(data.title, db),
            abstract=data.abstract,
            content=data.content,
            file_id=data.file_id,
            featured=str(data.featured) if data.featured is not None else "False",
            is_published=is_pub,
            publication_date=pub_date,
            created_by=current_user.id
        )
        db.add(research)
        db.flush()

        for order, member_id in enumerate(data.author_ids, start=1):
            author = ResearchAuthor(
                research_id=research.id,
                member_id=member_id,
                author_order=order
            )
            db.add(author)
        
        db.commit()
        db.refresh(research)
        return research
    
    @staticmethod
    def show_all(db: Session, current_user,
                 page: int = 1, search: str = None,
                 limit: int = 10, title: str = None,
                 sort: str = "publication_date",
                 order: str = "desc",
                 subgroup_id: int = None):

        roles = current_user.roles if current_user else []
        query = db.query(Research).options(
            joinedload(Research.file),
            joinedload(Research.authors).joinedload(ResearchAuthor.member)
        )
        
        if subgroup_id:
            query = query.join(ResearchAuthor).join(Members).filter(Members.subgroup_id == subgroup_id)

        if "super_admin" in roles:
            pass
        elif "editor" in roles:
            query = query.filter(
                (Research.is_published == True) | 
                (Research.created_by == current_user.id)
            )
        else:
            query = query.filter(Research.is_published == True)

        if search:
            query = query.filter(or_(
                Research.title.ilike(f"%{search}%"),
                Research.abstract.ilike(f"%{search}%"),
                Research.content.ilike(f"%{search}%")
            )) 

        if sort == "title":
            if order == "asc":
                query = query.order_by(asc(Research.title))
            else:
                query = query.order_by(desc(Research.title))    
        else:
            if order == "asc":
                query = query.order_by(asc(Research.publication_date).nullslast())
            else:
                query = query.order_by(desc(Research.publication_date).nullslast()) 
                            
        skip = (page - 1) * limit 
        results = query.offset(skip).limit(limit).all()
        return results
    
    @staticmethod
    def show_by_id(research_id: int, db: Session, current_user):
        research = db.query(Research).options(
            joinedload(Research.file),
            joinedload(Research.authors)
        ).filter(Research.id == research_id).first()

        if not research:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research not found")

        roles = current_user.roles if current_user else []
        if "super_admin" in roles:
            pass
        elif "editor" in roles:
            if not research.is_published and research.publication_date is None and research.created_by != current_user.id:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research not found")
        else:
            if not research.is_published and research.publication_date is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research not found")
                    
        return research
    
    @staticmethod
    def update(research_id: int, data: Researchupdate, db: Session, current_user):
        research = db.query(Research).options(
            joinedload(Research.file),
            joinedload(Research.authors)
        ).filter(Research.id == research_id).first()

        if not research:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research not found")

        roles = current_user.roles
        if "super_admin" in roles:
            pass
        elif "editor" in roles:
            if research.created_by != current_user.id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to edit this research")

        if data.featured is not None:
            research.featured = str(data.featured)

        if data.is_published is not None:
            research.is_published = data.is_published
            if data.is_published and research.publication_date is None:
                research.publication_date = datetime.now()

        if data.publication_date is not None:
            research.publication_date = data.publication_date
            if not research.is_published:
                research.is_published = True

        if data.title is not None:
            research.title = data.title
            research.slug = ResearchServices.generate_slug(data.title, db)

        if data.abstract is not None:
            research.abstract = data.abstract

        if data.content is not None:
            research.content = data.content

        if data.file_id is not None:
            research.file_id = data.file_id

        if data.author_ids is not None:
            member = db.query(Members).filter(Members.id.in_(data.author_ids)).all()
            if len(member) != len(data.author_ids):
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="One or more authors not found")
            research.authors.clear()
            for order, member_id in enumerate(data.author_ids, start=1):
                author = ResearchAuthor(
                    member_id=member_id,
                    author_order=order
                )
                research.authors.append(author)  
          
        db.commit()
        db.refresh(research)
        return research
    
    @staticmethod
    def deleteresource(research_id, db: Session, current_user):
        research = db.query(Research).filter(Research.id == research_id).first()
        if not research:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research not found")

        roles = current_user.roles
        if "super_admin" in roles:
            pass
        elif "editor" in roles:
            if research.created_by != current_user.id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to perform this action")
            
        if research.file_id:
            media_record = db.query(Media).filter(Media.id == research.file_id).first()
            if media_record:
                delete_upload_file(media_record.path)
                db.delete(media_record)

        db.delete(research)
        db.commit()
        
        return {
            "message": "Research deleted successfully"
        }


class ResearchMediaService:
    @staticmethod
    def CreateFile(research_id: int, path: str, mime_type: str, original_filename: str, db: Session, current_user_id: int):
        research = db.query(Research).filter(Research.id == research_id).first()
        if not research:
            raise HTTPException(status_code=404, detail="Research not found")
            
        user = db.query(Users).filter(Users.id == current_user_id).first()
        roles = user.roles if user else []
        if research.created_by != current_user_id and "super_admin" not in roles and "editor" not in roles:
            raise HTTPException(status_code=403, detail="Not authorized")
            
        media_record = db.query(Media).filter(Media.id == research.file_id).first() if research.file_id else None
        
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
        roles = user.roles if user else []
        if research.created_by != current_user_id and "super_admin" not in roles and "editor" not in roles:
            raise HTTPException(status_code=403, detail="Not authorized")
            
        if not research.file_id:
            raise HTTPException(status_code=404, detail="No file found for this research")
            
        media_record = db.query(Media).filter(Media.id == research.file_id).first()
        if media_record:
            delete_upload_file(media_record.path)
            db.delete(media_record)

        research.file_id = None
        db.commit()
        return {"message": "File deleted successfully"}

