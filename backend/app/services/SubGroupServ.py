from app.schemas import SubGroupSchm
from app.models import SubGroupModel,media,ModoleUsers
from fastapi import HTTPException,status
from sqlalchemy.orm  import Session
from sqlalchemy.exc  import IntegrityError
from .storage.local import delete_upload_file





class SubGroups:

    @staticmethod
    def GenerateSlug(title:str,db:Session):
        base_slug = title.lower().replace(" ", "-")

        slug = base_slug

        counter = 1

        while db.query(SubGroupModel.SubGroup).filter(SubGroupModel.SubGroup.slug == slug).first():
            slug = f"{base_slug}-{counter}"

            counter += 1

        return slug
    @staticmethod
    def _validate_lead(lead_id: int, db: Session):
        from app.models.ModoleUsers import Users
        user = db.query(Users).filter(Users.id == lead_id).first()
        if not user:
            raise HTTPException(status_code=400, detail="The selected leader user does not exist.")
        if not user.is_active:
            raise HTTPException(status_code=400, detail="The selected leader user is not active.")

    @staticmethod
    def create_subgrp(request: SubGroupSchm.SubGroup, db: Session, current_user_id: int):
        lead_id = request.lead_id if (request.lead_id and request.lead_id > 0) else None
        if lead_id:
            SubGroups._validate_lead(lead_id, db)
            
        slug = SubGroups.GenerateSlug(request.name, db)
        new_subgroup = SubGroupModel.SubGroup(
            name=request.name,
            slug=slug,
            description=request.description,
            lead_id=lead_id
        )

        try:
            db.add(new_subgroup)
            db.commit()
            db.refresh(new_subgroup)
            
            if lead_id:
                SubGroups._assign_editor_role(lead_id, db)
                
            return SubGroups.get_single(new_subgroup.id, db)
                
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="Conflict: Subgroup name already exists.")

    @staticmethod
    def get_all(db: Session):
        from sqlalchemy.orm import joinedload
        groups = db.query(SubGroupModel.SubGroup).options(
            joinedload(SubGroupModel.SubGroup.leader),
            joinedload(SubGroupModel.SubGroup.Sub_icon),
            joinedload(SubGroupModel.SubGroup.sub_cover)
        ).all()
        return groups or []

    @staticmethod
    def get_single(id, db: Session):
        from sqlalchemy.orm import joinedload
        group = db.query(SubGroupModel.SubGroup).options(
            joinedload(SubGroupModel.SubGroup.leader),
            joinedload(SubGroupModel.SubGroup.Sub_icon),
            joinedload(SubGroupModel.SubGroup.sub_cover)
        ).filter(SubGroupModel.SubGroup.id == id).first()

        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"sub-group with id of {id} not found"
            )
        return group

    @staticmethod
    def update_group(id, request: SubGroupSchm.SubGroup, db: Session):
        exist_group = db.query(SubGroupModel.SubGroup).filter(SubGroupModel.SubGroup.id == id).first()

        if not exist_group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"the group with that id {id} not found"
            )
            
        if request.name != exist_group.name:
            slug = SubGroups.GenerateSlug(request.name, db)
            exist_group.name = request.name
            exist_group.slug = slug
            
        exist_group.description = request.description
        
        lead_id = request.lead_id if (request.lead_id and request.lead_id > 0) else None
        if lead_id:
            SubGroups._validate_lead(lead_id, db)
            exist_group.lead_id = lead_id
            SubGroups._assign_editor_role(lead_id, db)
        else:
            exist_group.lead_id = None

        try:
            db.commit()
            return SubGroups.get_single(exist_group.id, db)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail="conflicts: data already exist"
            )

    @staticmethod
    def _assign_editor_role(user_id: int, db: Session):
        from app.models.ModoleRoles import Role
        from app.models.ModelUserRoles import UserRole
        editor_role = db.query(Role).filter(Role.name == "editor").first()
        if editor_role:
            has_role = db.query(UserRole).filter(
                UserRole.user_id == user_id, 
                UserRole.role_id == editor_role.id
            ).first()
            if not has_role:
                new_role = UserRole(user_id=user_id, role_id=editor_role.id)
                db.add(new_role)
                db.commit()

    @staticmethod
    def delete_group(id,db:Session):
        group = db.query(SubGroupModel.SubGroup).filter(SubGroupModel.SubGroup.id==id).delete(synchronize_session=False)

        db.commit()

        if not group:
            raise HTTPException(
                status_code=404,
                detail= f"group with id of {id} not found"
            )

        return {"message":"group deleted succesfull"}
  # here is  where cover upload service started 
    @staticmethod
    def AddCover(
            subGroup_id:int,
            db:Session,
            current_user_id:int,
            path:str
            
    ):

        subgroup = db.query(SubGroupModel.SubGroup).filter(
            SubGroupModel.SubGroup.id == subGroup_id
            
        ).first()

        if not subgroup:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"sub group with that id of {subGroup_id} not found"
            )

        cover = db.query(media.Media).filter(
            media.Media.id == subgroup.cover_page_id
        ).first()



        if cover :
            cover.filename = path
            delete_upload_file(cover.path)
            cover.path = path
            cover.original_filename = "sub group cover"
            db.commit()
            db.refresh(cover)
            return cover
        else:
            cover = media.Media(
                filename = path,
                path = path,
                original_filename = "sub group cover",
                mime_type="image/jpeg",
                uploaded_by=current_user_id,

            )

            db.add(cover)
            db.flush()
        subgroup.cover_page_id = cover.id

        db.commit()
        db.refresh(cover)

        return cover 

    @staticmethod
    def ReturnCover(subgroup_id:int,db:Session):

        subgroup = db.query(SubGroupModel.SubGroup).filter(
            SubGroupModel.SubGroup.id == subgroup_id
        ).first()

        if not subgroup:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"sub group with id of {subgroup_id} not found"
            )

        cover = db.query(media.Media).filter(
            media.Media.id == subgroup.cover_page_id
        ).first()

        if not cover:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="sub group do not have cover photo"
            )
        return cover  


    @staticmethod
    def RemoveCover(subgroup_id:int,db:Session):
        subgroup =db.query(SubGroupModel.SubGroup).filter(
            SubGroupModel.SubGroup.id == subgroup_id
        )  .first()

        if not subgroup:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"subgroup with that id {subgroup_id} not found"
            )

        cover = db.query(media.Media).filter(
            media.Media.id == subgroup.cover_page_id
        ).first()

        if not  cover:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="you do not have cover page"

            )

        delete_upload_file(cover.path)
        subgroup.cover_page_id = None

        db.delete(cover)
        db.commit()

        return {"message":"cover has been deleted"}

    # here is where route for Icon started
    @staticmethod
    def AddIcon(
                
                subGroup_id:int,
                db:Session,
                current_user_id:int,
                path:str
                
        ):
    
            subgroup = db.query(SubGroupModel.SubGroup).filter(
                SubGroupModel.SubGroup.id == subGroup_id
                
            ).first()
    
            if not subgroup:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail= f"sub group with that id of {subGroup_id} not found"
                )
    
            icon = db.query(media.Media).filter(
                media.Media.id == subgroup.icon_id
            ).first()
    
    
    
            if icon :
                icon.filename = path
                delete_upload_file(icon.path)
                icon.path = path
                icon.original_filename = "sub group icon"
                db.commit()
                db.refresh(icon)
                return icon
            else:
                icon = media.Media(
                    filename = path,
                    path = path,
                    original_filename = "sub group icon",
                    mime_type="image/jpeg",
                    uploaded_by=current_user_id,
    
                )
    
                db.add(icon)
                db.flush()
            subgroup.icon_id = icon.id
    
            db.commit()
            db.refresh(icon)
    
            return icon 
    
    @staticmethod
    def ReturnIcon(subgroup_id:int,db:Session):
    
            subgroup = db.query(SubGroupModel.SubGroup).filter(
                SubGroupModel.SubGroup.id == subgroup_id
            ).first()
    
            if not subgroup:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail= f"sub group with id of {subgroup_id} not found"
                )
    
            icon = db.query(media.Media).filter(
                media.Media.id == subgroup.icon_id
            ).first()
    
            if not icon:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="sub group do not have icon photo"
                )
            return icon  
    
    
    @staticmethod
    def RemoveIcon(subgroup_id:int,db:Session):
            subgroup =db.query(SubGroupModel.SubGroup).filter(
                SubGroupModel.SubGroup.id == subgroup_id
            )  .first()
    
            if not subgroup:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail= f"subgroup with that id {subgroup_id} not found"
                )
    
            icon = db.query(media.Media).filter(
                media.Media.id == subgroup.icon_id
            ).first()
    
            if not  icon:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="you do not have id icon"
    
                )
    
            delete_upload_file(icon.path)
            subgroup.icon_id = None
    
            db.delete(icon)
            db.commit()
    
            return {"message":"icon has been deleted"}
    
    
    
    
                
                
    
    
    
    
    
        
    
    
    
            




            
            





    



        
