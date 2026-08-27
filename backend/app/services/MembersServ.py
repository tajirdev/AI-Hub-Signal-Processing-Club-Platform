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
            
            # Explicit business rule: Assign 'member' role when user becomes a member
            from app.models.ModoleRoles import Role
            from app.models.ModelUserRoles import UserRole
            
            member_role = db.query(Role).filter(Role.name == "member").first()
            if member_role:
                # Check if user already has the member role
                has_role = db.query(UserRole).filter(
                    UserRole.user_id == target_user_id,
                    UserRole.role_id == member_role.id
                ).first()
                if not has_role:
                    new_role = UserRole(user_id=target_user_id, role_id=member_role.id)
                    db.add(new_role)
                    db.commit()
            
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=400,detail="conflict: multiple data"
            )

        return new_member

    def GetAll(
        self,
        db: Session,
        current_user=None,
        skip: int = 0,
        limit: int = 10,
        search: str | None = None,
        sort_by: str = "joined_at",
        order: str = "desc",
        sub_group_id: int | None = None
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

        roles = current_user.roles if current_user else []
        if "super_admin" in roles:
            pass
        elif "editor" in roles:
            query = query.filter(
                (ModoleMembers.Members.show_profile == True) | 
                (ModoleMembers.Members.user_id == current_user.id)
            )
        else:
            query = query.filter(ModoleMembers.Members.show_profile == True)

        if sub_group_id:
            query = query.filter(ModoleMembers.Members.subgroup_id == sub_group_id)

        if search:
            query = query.filter(
                or_(
                    ModoleUsers.Users.first_name.ilike(f"%{search}%"),
                    ModoleUsers.Users.last_name.ilike(f"%{search}%"),
                    ModoleUsers.Users.user_name.ilike(f"%{search}%"),
                    ModoleUsers.Users.email.ilike(f"%{search}%"),
                    ModoleMembers.Members.position.ilike(f"%{search}%"),
                    SubGroupModel.SubGroup.name.ilike(f"%{search}%")
                )
            )

        total = query.count()

        sort_columns = {
            "first_name": ModoleUsers.Users.first_name,
            "last_name": ModoleUsers.Users.last_name,
            "user_name": ModoleUsers.Users.user_name,
            "email": ModoleUsers.Users.email,
            "position": ModoleMembers.Members.position,
            "joined_at": ModoleMembers.Members.joined_at,
            "subgroup": SubGroupModel.SubGroup.name,
            "sub_group": SubGroupModel.SubGroup.name
        }

        column = sort_columns.get(sort_by, ModoleMembers.Members.joined_at)

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
                "id": member.id,
                "user_id": member.user_id,
                "subgroup_id": member.subgroup_id,
                "sub_group_id": member.subgroup_id,
                "name": f"{member.user.first_name or ''} {member.user.last_name or ''}".strip() or member.user.user_name,
                "sub_group": member.subgroup.name if member.subgroup else "General",
                "subgroup": {
                    "id": member.subgroup.id if member.subgroup else None,
                    "name": member.subgroup.name if member.subgroup else "General",
                    "slug": member.subgroup.slug if member.subgroup else ""
                },
                "user": {
                    "id": member.user.id,
                    "first_name": member.user.first_name,
                    "last_name": member.user.last_name,
                    "user_name": member.user.user_name,
                    "email": member.user.email,
                    "avatar_url": member.user.avatar_url,
                    "is_active": member.user.is_active,
                    "roles": member.user.roles
                },
                "position": member.position,
                "github": member.github,
                "linkedin": member.linkedin,
                "portfolio": member.portfolio,
                "show_profile": member.show_profile,
                "joined_at": member.joined_at.isoformat() if member.joined_at else None
            })

        return {
            "total": total,
            "skip": skip,
            "limit": limit,
            "returned": len(results),
            "results": results
        } 


    def GetMe(self,db:Session,current_user_id):
        member = db.query(
            ModoleMembers.Members
        ).filter(
            ModoleMembers.Members.user_id == current_user_id
        ).first()

        if not member:
            from fastapi import HTTPException, status
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="You do not have a member profile."
            )
        
        # Get the current_user object to pass to GetSingle
        from app.models import ModoleUsers
        current_user = db.query(ModoleUsers.Users).filter(ModoleUsers.Users.id == current_user_id).first()
        
        return self.GetSingle(member.id, db, current_user)

    def GetSingle(self,member_id:int,db:Session,current_user=None):
        member = db.query(ModoleMembers.Members).filter(ModoleMembers.Members.id == member_id).first()

        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"there is no member with that id of {member_id}"
            )
            
        roles = current_user.roles if current_user else []
        is_owner = current_user and current_user.id == member.user_id
        is_admin = "super_admin" in roles
        is_editor = "editor" in roles

        if not member.show_profile and not (is_owner or is_admin or is_editor):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Profile is hidden"
            )

        user = member.user
        
        # Determine if we should include extra details (like news, events, blogs)
        is_mentor = "mentor" in user.roles
        include_extra = is_mentor or is_owner
        
        projects = []
        # Projects: If member is in a subgroup, get projects from the subgroup leader
        if member.subgroup and member.subgroup.leader:
            for p in member.subgroup.leader.project:
                if p.status == "active" or is_owner:
                    projects.append({**{k: v for k, v in p.__dict__.items() if not k.startswith("_")}, "type": "Project"})
        # Alternatively, if they have personal projects, we might add them too
        if user.project:
            for p in user.project:
                if p.status == "active" or is_owner:
                    # Prevent duplicates
                    if not any(proj['id'] == p.id for proj in projects):
                        projects.append({**{k: v for k, v in p.__dict__.items() if not k.startswith("_")}, "type": "Project"})
                    
        research = []
        # Research: The member is an author
        if member.research_authors:
            for ra in member.research_authors:
                r = ra.research
                if r and (r.is_published or is_owner):
                    research.append({**{k: v for k, v in r.__dict__.items() if not k.startswith("_")}, "type": "Research"})
                    
        news = []
        events = []
        blogs = []
        
        if include_extra:
            if user.new:
                for n in user.new:
                    news.append({**{k: v for k, v in n.__dict__.items() if not k.startswith("_")}, "type": "News"})
            if user.event:
                for e in user.event:
                    events.append({**{k: v for k, v in e.__dict__.items() if not k.startswith("_")}, "type": "Event"})
            if user.blog_posts:
                for b in user.blog_posts:
                    blogs.append({**{k: v for k, v in b.__dict__.items() if not k.startswith("_")}, "type": "Blog"})

        return {
            "id": member.id,
            "user_id": member.user_id,
            "sub_group": member.subgroup.name if member.subgroup else "General",
            "position": member.position,
            "github": member.github,
            "linkedin": member.linkedin,
            "portfolio": member.portfolio,
            "show_profile": member.show_profile,
            "joined_at": member.joined_at.isoformat() if member.joined_at else None,
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "user_name": user.user_name,
                "email": user.email,
                "phone": user.phone,
                "bio": user.bio,
                "avatar_url": user.avatar_url,
                "roles": user.roles,
                "is_active": user.is_active
            },
            "projects": projects,
            "research": research,
            "news": news,
            "events": events,
            "blogs": blogs,
            "is_owner": is_owner
        }


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
        if request.show_profile is not None:
            me.show_profile = request.show_profile
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


    

    



