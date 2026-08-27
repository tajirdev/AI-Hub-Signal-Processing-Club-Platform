import re

filepath = 'backend/app/services/MembersServ.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

old_get_me = """    def GetMe(self,db:Session,current_user_id):
        member = db.query(
            ModoleMembers.Members
        ).filter(
            ModoleMembers.Members.user_id == current_user_id
        ).first()


        return member"""

new_get_me = """    def GetMe(self,db:Session,current_user_id):
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
        
        return self.GetSingle(member.id, db, current_user)"""

text = text.replace(old_get_me, new_get_me)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

