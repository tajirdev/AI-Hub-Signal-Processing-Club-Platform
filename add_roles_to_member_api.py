import re

filepath = 'backend/app/services/MembersServ.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# I will add "roles": member.user.roles inside the "user" dict inside results.append
text = text.replace(
    '"is_active": member.user.is_active',
    '"is_active": member.user.is_active,\n                    "roles": member.user.roles'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

