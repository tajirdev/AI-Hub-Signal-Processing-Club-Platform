

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.resource import Resource
from app.models.ModoleUsers import Users
from app.schemas.resourse import ResourceCreate, ResourceUpdate
from app.models.SubGroupModel import SubGroup
from sqlalchemy import asc, desc, or_



class ResourceService:
    @staticmethod
    def create_resource(db: Session, resource: ResourceCreate, uploaded_by: int):
        subgroup= db.query(SubGroup).filter(SubGroup.id == resource.subgroup_id).first()
        if not subgroup:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subgroup not found")
        db_resource = Resource(title=resource.title, 
                                   description=resource.description, 
                                   type=resource.type.value, 
                                   external_url=str(resource.external_url) if resource.external_url else None,
                                    subgroup_id=resource.subgroup_id, uploaded_by=uploaded_by)
        db.add(db_resource)
        db.commit()
        db.refresh(db_resource)
        return db_resource


    @staticmethod
    def get_all_resources(db:Session, page:int=1, limit:int=10, search:str=None, subgroup_id:int=None, resource_type:str=None, sort:str="created_at", sort_order:str="desc"):
    
            query = db.query(Resource)
    
            if search:
                query = query.filter(or_(Resource.title.ilike(f"%{search}%"), Resource.description.ilike(f"%{search}%")))
    
            if subgroup_id:
                query = query.filter(Resource.subgroup_id == subgroup_id)
    
            if resource_type:
                query = query.filter(Resource.type == resource_type)
    
            sort_column = getattr(Resource, sort, Resource.created_at)
    
            if sort_order.lower() == "asc":
                query = query.order_by(asc(sort_column))
            else:
                query = query.order_by(desc(sort_column))
    
            total = query.count()
            offset = (page - 1) * limit
            results = query.offset(offset).limit(limit).all()
            return {
                "total": total,
                "page": page,
                "limit": limit,
                "returned": len(results),
                "results": results
            }
  

    @staticmethod
    def get_resource_by_id(db: Session, resource_id: int):
        resource=db.query(Resource).filter(Resource.id == resource_id).first()
        if not resource:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="resource not found")
        return resource
    
    
   

    @staticmethod
    def update_resource(resource_id: int, request:ResourceUpdate, db: Session, current_user: Users):
        if request.subgroup_id:
            subgroup= db.query(SubGroup).filter(SubGroup.id ==request.subgroup_id ).first()
            if not subgroup:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subgroup not found")
        resource=db.query(Resource).filter(Resource.id==resource_id).first()
        if not resource:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
        #ownership check
        roles = current_user.roles
        if resource.uploaded_by != current_user.id and "super_admin" not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to update this resource")
        if request.title is not None:
            resource.title=request.title
        if request.type is not None:
            resource.type=request.type     
        if request.external_url is not None:
            resource.external_url=request.external_url
        if request.file_id is not None:
            resource.file_id=request.file_id
        if request.description is not None:
            resource.description=request.description
        if request.subgroup_id is not None:
            resource.subgroup_id=request.subgroup_id
        db.commit()
        db.refresh(resource)
        return resource

    @staticmethod
    def delete_resource(resource_id: int, db: Session, current_user: Users):
        from app.services.storage.local import delete_upload_file
        from app.models.media import Media
        resource=db.query(Resource).filter(Resource.id==resource_id).first()
        if not resource:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
        #ownership check
    
        roles = current_user.roles
        if (resource.uploaded_by != current_user.id and "super_admin" not in roles):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this resource")
        
        if resource.file_id:
            media_record = db.query(Media).filter(Media.id == resource.file_id).first()
            if media_record:
                delete_upload_file(media_record.path)
                db.delete(media_record)

        db.delete(resource)
        db.commit()
        return {"message": "Resource deleted successfully"}

from app.models.media import Media
from app.services.storage.local import delete_upload_file

class ResourceMediaService:
    @staticmethod
    def CreateFile(resource_id: int, path: str, mime_type: str, original_filename: str, db: Session, current_user_id: int):
        resource = db.query(Resource).filter(Resource.id == resource_id).first()
        if not resource:
            raise HTTPException(status_code=404, detail="Resource not found")
            
        user = db.query(Users).filter(Users.id == current_user_id).first()
        if resource.uploaded_by != current_user_id and "super_admin" not in user.roles:
            raise HTTPException(status_code=403, detail="Not authorized")
            
        media_record = db.query(Media).filter(Media.id == resource.file_id).first()
        
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
            
        resource.file_id = media_record.id
        db.commit()
        db.refresh(media_record)
        return media_record
        
    @staticmethod
    def RemoveFile(resource_id: int, db: Session, current_user_id: int):
        resource = db.query(Resource).filter(Resource.id == resource_id).first()
        if not resource:
            raise HTTPException(status_code=404, detail="Resource not found")
            
        user = db.query(Users).filter(Users.id == current_user_id).first()
        if resource.uploaded_by != current_user_id and "super_admin" not in user.roles:
            raise HTTPException(status_code=403, detail="Not authorized")
            
        media_record = db.query(Media).filter(Media.id == resource.file_id).first()
        if not media_record:
            raise HTTPException(status_code=404, detail="No file found for this resource")
            
        delete_upload_file(media_record.path)
        resource.file_id = None
        db.delete(media_record)
        db.commit()
        return {"message": "File deleted successfully"}

