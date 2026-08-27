import re

filepath = 'backend/app/routes/MemberRouter.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add get_optional_current_user to auth imports
if 'get_optional_current_user' not in text:
    text = re.sub(
        r'from app\.core\.auth import get_current_user',
        'from app.core.auth import get_current_user, get_optional_current_user',
        text
    )
    if 'get_optional_current_user' not in text: # If the first replace failed
        text = text.replace('from app.core.auth import', 'from app.core.auth import get_optional_current_user, ')

# Modify All to accept current_user
if 'current_user: Optional[ModoleUsers.Users]' not in text:
    text = re.sub(
        r'(def All\([^)]+)subgroup_id: int \| None = Query\(None, description="Alias for sub_group_id"\)',
        r'\1subgroup_id: int | None = Query(None, description="Alias for sub_group_id"),\n    current_user: Optional[ModoleUsers.Users] = Depends(get_optional_current_user)',
        text
    )

    text = re.sub(
        r'return Services\.GetAll\(db, skip, limit, search, sort_by, order, sub_group_id=target_subgroup_id\)',
        r'return Services.GetAll(db, current_user, skip, limit, search, sort_by, order, sub_group_id=target_subgroup_id)',
        text
    )

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

