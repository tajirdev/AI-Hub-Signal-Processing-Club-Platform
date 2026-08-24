from app.models import EventModel,media,ModoleUsers,ModelUserRoles,ModoleRoles
from app.schemas import EventSchm
from sqlalchemy.orm import Session,joinedload
from fastapi import status,HTTPException
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_,asc,desc
from .storage.local import delete_upload_file



class Event:
    @staticmethod
    def CreateEvent(request:EventSchm.EventCreate,db:Session,current_user_id:int):
        new_event= EventModel.Events(
            title = request.title,
            description  = request.description,
            location  = request.location,
            event_date = request.event_date,
            status  = request.status,
            registration_link = request.registration_link,
            category_id = request.category_id,
            created_by = current_user_id  

        )

        if request.status == EventModel.EventStatus.published:
            new_event.published_at = datetime.now()

        try:
            db.add(new_event)
            db.commit()
            db.refresh(new_event)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail="duplicated data"
            )        
        return new_event
    
    @staticmethod
    def ReturnAll(current_user,db:Session,
                    page:int=1,search:str=None,
                    limit:int=10,
                    status:str=None,
                        sort:str="published_at",order:str="desc"):
        roles = current_user.roles if current_user else []
        event =db.query(EventModel.Events)


        if "super_admin" in roles:
            pass
        
        elif "editor" in roles:
            event=event.filter((EventModel.Events.status==EventModel.EventStatus.published)|(EventModel.Events.created_by==current_user.id)) 
            
        elif "member" in roles:
            event=event.filter(EventModel.Events.status==EventModel.EventStatus.published)
            
        
        #search
        if search:
            event=event.filter(or_(
                EventModel.Events.title.ilike(f"%{search}%"),
                EventModel.Events.description.ilike(f"%{search}%"),
            ))      
        if status:
            event=event.filter(EventModel.Events.status==status) 
        
        if sort=="title":
            if order=="asc":
                event=event.order_by(asc(EventModel.Events.title))
            else:
                event=event.order_by(desc(EventModel.Events.title))    
        else:
            if order =="asc":
                event=event.order_by(asc(EventModel.Events.published_at))
            else:
                event=event.order_by(desc(EventModel.Events.published_at)) 
                                
        skip = (page - 1)* limit        
        events=(
            event
            .offset(skip)
            .limit(limit)
            .all()
        )
        return events


    @staticmethod
    def ReturnMy(db:Session,current_user_id:int):
        events = db.query(EventModel.Events).filter(
            EventModel.Events.created_by==current_user_id
        ).all()

        if not events:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="event of that user not found"
            )

        return events

    @staticmethod
    def ReturnSingle(event_id:int,db:Session):
        event = db.query(EventModel.Events).filter(
            EventModel.Events.id == event_id 
        ).first()

        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"event with the id of {event_id} not found"
            )

        return event

    @staticmethod
    def EditeMy(event_id:int,request:EventSchm.EventUpdate,db:Session,current_user_id):
        event = db.query(EventModel.Events).filter(
            EventModel.Events.id ==event_id
        ).first()

        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"event with id of {event_id} not found"
            )

        if not event.created_by == current_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="action not allowed your not the owner"
            )

        if request.title is not None:
            event.title = request.title 
        if request.description is not None:
            event.description = request.description
        if request.location is not None:
            event.location  = request.location
        if request.event_date is not None:
            event.event_date = request.event_date
        if request.registration_link is not None:
            event.registration_link = request.registration_link
        if request.status is not None:
            event.status = request.status
        if request.category_id is not None:
            event.category_id = request.category_id

        try:
            db.commit()
            db.refresh(event)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail="bad request"
            )

        return event
        



    @staticmethod
    def Upadate(event_id:int,request:EventSchm.EventUpdate,db:Session,current_user_id:int):
        event = db.query(EventModel.Events).filter(
            EventModel.Events.id == event_id
        ).first()

        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"event with id of {event_id} not found"
            )

        if request.title is not None:
            event.title = request.title 
        if request.description is not None:
            event.description = request.description
        if request.location is not None:
            event.location  = request.location
        if request.event_date is not None:
            event.event_date = request.event_date
        if request.registration_link is not None:
            event.registration_link = request.registration_link
        if request.status is not None:
            event.status = request.status
        if request.category_id is not None:
            event.category_id = request.category_id

        try:
            db.commit()
            db.refresh(event)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail="bad request"
            )

        return event


    @staticmethod
    def RemoveEvent(event_id:int,db:Session):
        event = db.query(EventModel.Events).filter(
            EventModel.Events.id == event_id
        ).delete(synchronize_session=False)

        db.commit()


        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"event with the id of {event_id} not found"
            )

        return {"message": f"evenet with id of {event_id} deleted"}

    @staticmethod
    def RemoveMyEvent(event_id:int,db:Session,current_user_id:int):
            available_event = db.query(EventModel.Events).filter(
                EventModel.Events.id == event_id
            )

            event = available_event.first()

            if not event:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail= f"event with the id of {event_id} not found"
                )

            if not event.created_by == current_user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="action not allowed your not the owner"
                )




            available_event.delete(synchronize_session=False)
            db.commit()
    
            return {"message": f"evenet with id of {event_id} deleted"}

    @staticmethod
    def CreateCover(event_id:int,db:Session,path:str,current_user_id:int):

        event = db.query(EventModel.Events).filter(
            EventModel.Events.id == event_id
        ).first()

        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"event with that id of {event_id} not found"
            )

        cover = db.query(media.Media).filter(
            media.Media.id == event.cover_image_id
        ).first()

        if cover:
            cover.filename = path
            delete_upload_file(cover.path)
            cover.path = path
            cover.original_filename = "cover page"
            db.commit()
            db.refresh(cover)
        else:
            cover = media.Media(
                filename = path,      
                path = path,
                original_filename = "cover page",
                mime_type="image/jpeg",
                uploaded_by=current_user_id

            )
            db.add(cover)
            db.flush()
            event.cover_image_id = cover.id
            db.commit()
            db.refresh(cover)



        return cover

    @staticmethod
    def GetCover(event_id:int, db:Session,):
        event = db.query(EventModel.Events).filter(
            EventModel.Events.id == event_id
        ).first()

        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"event with id of {event_id} not found"

            )

        cover = db.query(media.Media).filter(
            media.Media.id == event.cover_image_id
        ).first()

        if not cover :
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="event has no cover image"
            )

        return cover

    @staticmethod
    def RemoveCover( event_id:int,db:Session,current_user_id:int):
        event = db.query(EventModel.Events).filter(
            EventModel.Events.id == event_id
        ).first()

        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"event with id of {event_id} not found"
            )

        user = db.query(ModoleUsers.Users).filter(
            ModoleUsers.Users.id == current_user_id
        ).first()

        cover = db.query(media.Media).filter(
            media.Media.id == event.cover_image_id
        ).first()

        if not cover:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="you don't have cover"
            )

        if "super_admin" not in user.roles and cover.uploaded_by != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="your are not the owner"
            )

        delete_upload_file(cover.path)
        event.cover_image_id = None
        db.delete(cover)
        db.commit()
        return {"message":"you have deleted cover image"}
