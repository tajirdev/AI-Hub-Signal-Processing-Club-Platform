from app.schemas import SubGroupSchm
from app.models import SubGroupModel,media,ModoleUsers
from fastapi import HTTPException,status
from sqlalchemy.orm  import Session
from sqlalchemy.exc  import IntegrityError
from .storage.local import delete_upload_file





class SubGroups:

    def __init__(self):
        pass

    def GenerateSlug(self,title:str,db:Session):
        base_slug = title.lower().replace(" ", "-")

        slug = base_slug

        counter = 1

        while db.query(SubGroupModel.SubGroup).filter(SubGroupModel.SubGroup.slug == slug).first():
            slug = f"{base_slug}-{counter}"

            counter = 1

        return slug

    def create_subgrp(self,request:SubGroupSchm.SubGroup,db:Session,current_user_id:int):

        slug =self.GenerateSlug(request.name,db)
        new_subgroup = SubGroupModel.SubGroup(
            name = request.name,
            slug = slug,
            description = request.description,
            lead_id = current_user_id  
        )

        try:
            db.add(new_subgroup)
            db.commit()
            db.refresh(new_subgroup)
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="Conflict: Data already exists.")

        return new_subgroup

    def get_all(self,db:Session):
        groups = db.query(SubGroupModel.SubGroup).all()


        if not groups :
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="no groups in data base"
                )

        return groups


    def get_single(self,id,db:Session):
        group = db.query(SubGroupModel.SubGroup).filter(SubGroupModel.SubGroup.id == id).first()

        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"sub-group with id of {id} not found"
            )
        return group


    def update_group(self,id,request:SubGroupSchm.SubGroup,db:Session):
        exist_group = db.query(SubGroupModel.SubGroup).filter(SubGroupModel.SubGroup.id == id).first()

        if not exist_group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"the group with that id {id} not found"
            )

        exist_group.name = request.name
        exist_group.slug = request.slug
        exist_group.description = request.description



        try:
          
            db.commit()
            db.refresh(exist_group)
        except IntegrityError:
            db.rollback()

            raise HTTPException (
                status_code=400,
                detail="conflicts: data already exist"
            )
        return exist_group


    def delete_group(self,id,db:Session):
        group = db.query(SubGroupModel.SubGroup).filter(SubGroupModel.SubGroup.id==id).delete(synchronize_session=False)

        db.commit()

        if not group:
            raise HTTPException(
                status_code=404,
                detail= f"group with id of {id} not found"
            )

        return {"message":"group deleted succesfull"}
  # this i service for uploading cover page 
    def AddCover(
            self,
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



            
            





    



        