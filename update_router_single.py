import re

filepath = 'backend/app/routes/MemberRouter.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

old_func = """@router.get("/{member_id}")
def ReturnSingle(
    member_id:int,
    db:Session=Depends(get_db),
    current_user:ModoleUsers.Users=Depends(admin_required)
):
    return Services.GetSingle(member_id,db)"""

new_func = """@router.get("/{member_id}")
def ReturnSingle(
    member_id:int,
    db:Session=Depends(get_db),
    current_user:Optional[ModoleUsers.Users]=Depends(get_optional_current_user)
):
    return Services.GetSingle(member_id,db,current_user)"""

text = text.replace(old_func, new_func)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

