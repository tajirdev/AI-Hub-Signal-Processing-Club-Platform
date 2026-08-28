import re

filepath = 'backend/app/schemas/EventSchm.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add import
if 'from app.schemas.SchemaUser import UserResponse' not in text:
    text = text.replace('from app.schemas.MediaScham import MediaResponse', 'from app.schemas.MediaScham import MediaResponse\nfrom app.schemas.SchemaUser import UserResponse')

# Add field
if 'user: Optional[UserResponse] = None' not in text:
    text = text.replace('created_by: int', 'created_by: int\n    user: Optional[UserResponse] = None')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

