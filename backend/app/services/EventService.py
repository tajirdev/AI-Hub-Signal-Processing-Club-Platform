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
        posts=event.offset(skip).limit(limit).all()
        return posts



  
