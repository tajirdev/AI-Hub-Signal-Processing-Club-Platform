import re

filepath = 'backend/app/services/MembersServ.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

old_func = """    def GetSingle(self,member_id:int,db:Session):
        member = db.query(ModoleMembers.Members).filter(ModoleMembers.Members.id == member_id).first()

        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"there is no member with that id of {member_id}"
            )

        return member"""

new_func = """    def GetSingle(self,member_id:int,db:Session,current_user=None):
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
        if user.project:
            for p in user.project:
                if p.status == "active" or is_owner:
                    projects.append({
                        "id": p.id,
                        "title": p.title,
                        "description": p.description,
                        "type": "Project",
                        "status": p.status
                    })
                    
        research = []
        if user.research:
            for r in user.research:
                if r.is_published or is_owner:
                    research.append({
                        "id": r.id,
                        "title": r.title,
                        "description": r.abstract,
                        "type": "Research",
                        "is_published": r.is_published
                    })
                    
        news = []
        events = []
        blogs = []
        
        if include_extra:
            if user.new:
                for n in user.new:
                    news.append({"id": n.id, "title": n.title, "type": "News"})
            if user.event:
                for e in user.event:
                    events.append({"id": e.id, "title": e.name, "type": "Event"})
            if user.blog_posts:
                for b in user.blog_posts:
                    blogs.append({"id": b.id, "title": b.title, "type": "Blog"})

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
        }"""

text = text.replace(old_func, new_func)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

