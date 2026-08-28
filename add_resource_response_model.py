import re

filepath = 'backend/app/routes/resource.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

if 'ResourcePagination' not in text:
    text = text.replace(
        'from app.schemas.resourse import ResourceCreate, ResourceUpdate, ResourceResponse',
        'from app.schemas.resourse import ResourceCreate, ResourceUpdate, ResourceResponse, ResourcePagination'
    )
    
text = text.replace(
    '@router.get("/")',
    '@router.get("/", response_model=ResourcePagination)'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

