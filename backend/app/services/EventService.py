from app.models import EventModel
from app.schemas import EventSchm
from sqlalchemy.orm import Session,joinedload
from fastapi import status,HTTPException
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_,asc,desc



class Event:
    def __init__(self):
        
        pass


    def CreateEvent(self,request:EventSchm.EventCreate,db:Session,current_user_id:int):
        new_event= EventModel.Events(
            title = request.title,
            description  = request.description,
            location  = request.location,
            event_date = request.event_date,
            registration_link = request.registration_link,
            cover_image = request.cover_image,
            status  = request.status,
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

    def ReturnAll(self,current_user,db:Session,
                    page:int=1,search:str=None,
                    limit:int=10,
                    status:str=None,
                        sort:str="published_at",order:str="desc"):
        roles=[ur.Roles.name for ur in current_user.userRole]
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



    def ReturnMy(self,db:Session,current_user_id:int):
        events = db.query(EventModel.Events).filter(
            EventModel.Events.created_by==current_user_id
        ).all()

        if not events:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="event of that user not found"
            )

        return events


    def ReturnSingle(self,event_id:int,db:Session,current_user_id:int):
        event = db.query(EventModel.Events).filter(
            EventModel.Events.id == event_id 
        ).first()

        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"event with the id of {event_id} not found"
            )

        return event


    def EditeMy(self,event_id:int,request:EventSchm.EventUpdate,db:Session,current_user_id):
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

        event.title = request.title 
        event.description = request.description
        event.location  = request.location
        event.event_date = request.event_date
        event.registration_link = request.registration_link
        event.cover_image = request.cover_image
        event.status = request.status


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
        



    def Upadate(self,event_id:int,request:EventSchm.EventUpdate,db:Session,current_user_id:int):
        event = db.query(EventModel.Events).filter(
            EventModel.Events.id == event_id
        ).first()

        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"event with id of {event_id} not found"
            )

        event.title = request.title 
        event.description = request.description
        event.location  = request.location
        event.event_date = request.event_date
        event.registration_link = request.registration_link
        event.cover_image = request.cover_image
        event.status = request.status

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



    def RemoveEvent(self,event_id:int,db:Session):
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

    def RemoveMyEvent(self,event_id:int,db:Session,current_user_id:int):
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


   






  
