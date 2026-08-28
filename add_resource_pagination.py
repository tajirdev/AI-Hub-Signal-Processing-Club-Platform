import re

filepath = 'backend/app/schemas/resourse.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add pagination schema
pagination_schema = """
class ResourcePagination(BaseModel):
    total: int
    page: int
    limit: int
    returned: int
    results: list[ResourceResponse]

    model_config = ConfigDict(from_attributes=True)
"""

if "class ResourcePagination" not in text:
    text += pagination_schema

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

