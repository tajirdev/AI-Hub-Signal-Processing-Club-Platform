from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.resource import Resource,Role
from app.models.ModoleUsers import Users
from app.repositories.resource_repository import ResourceRepository
from app.schemas.resourse import ResourceCreate, ResourceUpdate



class ResourceService:
    @staticmethod
    def create_resource(db: Session, resource: ResourceCreate, uploaded_by: int) -> Resource:
        if not resource.file_url and not resource.external_url:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Either file_url or external_url must be provided.")
        return ResourceRepository.create_resource(db=db, resource=resource, uploaded_by=uploaded_by)

    @staticmethod
    def get_all_resources(db: Session, page: int = 1, limit: int = 10, search: str = None, subgroup_id: int = None, resource_type: str = None, sort: str = "created_at", order: str = "desc"):
        return ResourceRepository.get_all(db=db, page=page, limit=limit, search=search, subgroup_id=subgroup_id, resource_type=resource_type, sort=sort, sort_order=order) 

    @staticmethod
    def get_resource_by_id(db: Session, resource_id: int) -> Resource:
        resource = ResourceRepository.get_by_id(db=db, resource_id=resource_id)
        if not resource:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
        return resource

    @staticmethod
    def update_resource(resource_id: int, request:ResourceUpdate, db: Session, current_user: Users) -> Resource:
        resource = ResourceRepository.get_by_id(db, resource_id)
        if not resource:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
        #ownership check
        roles=[ur.Roles.name for ur in current_user.userRole]
        if resource.uploaded_by != current_user.id and "super_admin" not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to update this resource")
        return ResourceRepository.update_resource(db=db, db_resource=resource, resource=request)

    @staticmethod
    def delete_resource(resource_id: int, db: Session, current_user: Users) -> dict:
        resource = ResourceRepository.get_by_id(db, resource_id)
        if not resource:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
        #ownership check
    
        roles=[ur.Roles.name for ur in current_user.userRole]
        if (resource.uploaded_by != current_user.id and "super_admin" not in roles):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this resource")
        ResourceRepository.delete_resource(db=db, db_resource=resource)
        return {"message": "Resource deleted successfully"}

