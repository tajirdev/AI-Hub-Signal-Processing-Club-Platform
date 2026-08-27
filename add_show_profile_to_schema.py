import re

filepath = 'backend/app/schemas/MemberSchm.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

if 'show_profile' not in text:
    text = text.replace(
        'user_id : Optional[int] = None',
        'user_id : Optional[int] = None\n    show_profile : Optional[bool] = None'
    )

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

