from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc, or_
from app.models.resource import Resource
from app.schemas.resourse import ResourceCreate, ResourceUpdate


class ResourceRepository:
    @staticmethod
    def create_resource(db: Session, resource: ResourceCreate, uploaded_by: int) -> Resource:
        db_resource = Resource(title=resource.title, description=resource.description, type=resource.type.value, file_url=str(resource.file_url) if resource.file_url else None, external_url=str(resource.external_url) if resource.external_url else None, subgroup_id=resource.subgroup_id, uploaded_by=uploaded_by)
        db.add(db_resource)
        db.commit()
        db.refresh(db_resource)
        return db_resource

    @staticmethod
    def get_all(db:Session, page:int=1, limit:int=10, search:str=None, subgroup_id:int=None, resource_type:str=None, sort:str="created_at", sort_order:str="desc") -> List[Resource]:

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
    def get_by_id(db: Session, resource_id: int) -> Optional[Resource]:
        return db.query(Resource).filter(Resource.id == resource_id).first()

    @staticmethod
    def update_resource(db: Session, db_resource: Resource, resource: ResourceUpdate) -> Resource:
        update_data = resource.dict(exclude_unset=True)
        if "type" in update_data:
            update_data["type"] = update_data["type"].value

        for key, value in update_data.items():
            if key in ["file_url", "external_url"] and value:
                value = str(value)
            setattr(db_resource, key, value)
        db.commit()
        db.refresh(db_resource)
        return db_resource

    @staticmethod
    def delete_resource(db: Session, db_resource: Resource) -> None:
        db.delete(db_resource)
        db.commit()