from app.schemas import MemberSchm
from app.models import ModoleMembers,SubGroupModel,ModoleUsers
from sqlalchemy.orm import Session,joinedload
from fastapi import HTTPException,status
from sqlalchemy.exc import IntegrityError

from sqlalchemy import or_



class MembersServices:
    def __init__(self):
        pass


    def CreateMember(self,sub_group_id,request:MemberSchm.Members,db:Session,current_user_id:int):
        target_user_id = request.user_id if request.user_id is not None else current_user_id

        exist_sub_group = db.query(SubGroupModel.SubGroup).filter(SubGroupModel.SubGroup.id== sub_group_id).first()

        exist_member = db.query(ModoleMembers.Members).filter(
            ModoleMembers.Members.user_id == target_user_id,
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
                detail="User is already a member of this subgroup"
            )

        new_member = ModoleMembers.Members(
            position = request.position,
            github = request.github,
            linkedin = request.linkedin,
            portfolio = request.portfolio,
            user_id = target_user_id,
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

    def GetAll(
            self,
            db:Session,
            skip:int,
            limit:int,
            search : str |None =None,
            sort_by: str = "joined_at",
            order : str = "desc"
            ):


        


        
        query = (
            db.query(ModoleMembers.Members)
            .join(ModoleMembers.Members.user)
            .join(ModoleMembers.Members.subgroup)
            .options(
                joinedload(ModoleMembers.Members.user),
                joinedload(ModoleMembers.Members.subgroup)
            )
        )

        if search:
            query = query.filter(
                or_(
                ModoleUsers.Users.first_name.ilike(f"%{search}%"),
                ModoleUsers.Users.last_name.ilike(f"%{search}%"),
                ModoleMembers.Members.position.ilike(f"%{search}%"),
                SubGroupModel.SubGroup.name.ilike(f"%{search}%")
                )
                                            
            )

        total =query.count()

        sort_columns = {
            "first_name": ModoleUsers.Users.first_name,
            "last_name": ModoleUsers.Users.last_name,
            "position": ModoleMembers.Members.position,
            "joined_at": ModoleMembers.Members.joined_at,
            "subgroup":SubGroupModel.SubGroup.name
        }

        column = sort_columns.get(sort_by,ModoleMembers.Members.joined_at)


        if order.lower() == "asc":
            query = query.order_by(column.asc())

        else:
            query = query.order_by(column.desc())

        members = (
            query
            .offset(skip)
            .limit(limit)
            .all()
        ) 


        results = []

        for member in members:
            results.append({
                "id":member.id,
                "name": f"{member.user.first_name},{member.user.last_name}",
                "sub_group":member.subgroup.name,
                "position":member.position,
                "github": member.github,
                "linkedin":member.linkedin,
                "portfolio":member.portfolio,
                "joined_at":member.joined_at

            })
        
        return{
            "total":total,
            "skip":skip,
            "limit":limit,
            "returned":len(results),
            "results":results

        } 


    def GetMe(self,db:Session,current_user_id):
        member = db.query(
            ModoleMembers.Members
        ).filter(
            ModoleMembers.Members.user_id == current_user_id
        ).first()


        return member

    def GetSingle(self,member_id:int,db:Session):
        member = db.query(ModoleMembers.Members).filter(ModoleMembers.Members.id == member_id).first()

        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"there is no member with that id of {member_id}"
            )

        return member


    def EditeMe(self,request:MemberSchm.Members,db:Session,current_user_id:int):
        me = db.query(ModoleMembers.Members).filter(ModoleMembers.Members.user_id==current_user_id).first()

        if not me:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="you are not a member of any sub group"
            )

        me.position = request.position
        me.github = request.github
        me.linkedin = request.linkedin
        me.portfolio = request.portfolio
        me.user_id = current_user_id

        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                 status_code=400,detail="conflict: multiple data"

            )
        return {"message":"updation secccessful"}


    def EditeSingle(self,member_id:int,sub_group_id :int,request:MemberSchm.Members,db:Session):
            me = db.query(ModoleMembers.Members).filter(ModoleMembers.Members.id==member_id).first()
            sub_group = db.query(SubGroupModel.SubGroup.id).filter(SubGroupModel.SubGroup.id == sub_group_id).first()


            if not me:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail= f"member with that id of {member_id}not found"
                )

            if not sub_group:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail= f"sub group with that id of {sub_group_id} not found"
                )

    
    
            me.position = request.position
            me.github = request.github
            me.linkedin = request.linkedin
            me.portfolio = request.portfolio
            me.subgroup_id = sub_group_id 
    
            try:
                db.commit()
            except IntegrityError:
                db.rollback()
                raise HTTPException(
                     status_code=400,detail="conflict: multiple data"
    
                )
            return {"message":"updation secccessful"}



    def RemoveMe(self,db:Session,current_user_id:int):
        me = db.query(ModoleMembers.Members).filter(
            ModoleMembers.Members.user_id == current_user_id
        ).delete(synchronize_session=False)

        db.commit()

        return {"message":"you have been removed from the sub group"}


    def RemoveSingle(self,member_id:int,db:Session):

        member = db.query(ModoleMembers.Members).filter(
            ModoleMembers.Members.id == member_id
        ).delete(synchronize_session=False)
        
        db.commit()


        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"member with id of {member_id} not found"
            )

        return {"message":"deleted"}


    

    



