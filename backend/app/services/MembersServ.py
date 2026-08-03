from app.schemas import MemberSchm
from app.models import ModoleMembers,SubGroupModel
from sqlalchemy.orm import Session
from fastapi import HTTPException,status
from sqlalchemy.exc import IntegrityError



class MembersServices:
    def __init__(self):
        pass


    def CreateMember(self,sub_group_id,request:MemberSchm.Members,db:Session,current_user_id:int):

        exist_sub_group = db.query(SubGroupModel.SubGroup).filter(SubGroupModel.SubGroup.id== sub_group_id).first()

        exist_member = db.query(ModoleMembers.Members).filter(
            ModoleMembers.Members.user_id == current_user_id,
            ModoleMembers.Members.subgroup_id ==sub_group_id
            ).first()

        


        if not exist_sub_group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"the sub group with that id {sub_group_id} not found"
            )

        if exist_member:
            raise HTTPException(
                status_code=400,
                detail="your already member of sub group"
            )

        new_member = ModoleMembers.Members(
            position = request.position,
            github = request.github,
            linkedin = request.linkedin,
            portfolio = request.portfolio,
            user_id = current_user_id,
            subgroup_id = sub_group_id 

        )

        try:
            db.add(new_member)
            db.commit()
            db.refresh(new_member)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=400,detail="conflict: multiple data"
            )

        return new_member


