from turtle import reset

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.resource import Resource,Role
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
                                   file_url=str(resource.file_url) if resource.file_url else None, 
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
    
            offset = (page - 1) * limit
            return (query.offset(offset).limit(limit).all())
  

    @staticmethod
    def get_resource_by_id(db: Session, resource_id: int):
        resource=db.query(Resource).filter(Resource.id == resource_id).first()
        if not resource:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="resource not found")
        return resource
    
    
   

    @staticmethod
    def update_resource(resource_id: int, request:ResourceUpdate, db: Session, current_user: Users):
        subgroup= db.query(SubGroup).filter(SubGroup.id ==request.subgroup_id ).first()
        if not subgroup:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subgroup not found")
        resource=db.query(Resource).filter(Resource.id==resource_id).first()
        if not resource:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
        #ownership check
        roles=[ur.Roles.name for ur in current_user.userRole]
        if resource.uploaded_by != current_user.id and "super_admin" not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to update this resource")
        if request.title:
            resource.title=request.title
        if request.type:
            resource.type=request.type     
        if request.external_url:
            resource.external_url=request.external_url
        if request.file_url:
            resource.file_url=request.file_url
        if request.description:
            resource.description=request.description
        if request.subgroup_id:
            resource.subgroup_id=request.subgroup_id
        return resource

    @staticmethod
    def delete_resource(resource_id: int, db: Session, current_user: Users):
        resource=db.query(Resource).filter(Resource.id==resource_id).first()
        if not resource:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
        #ownership check
    
        roles=[ur.Roles.name for ur in current_user.userRole]
        if (resource.uploaded_by != current_user.id and "super_admin" not in roles):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this resource")
        db.delete(resource)
        db.commit()
        return {"message": "Resource deleted successfully"}

