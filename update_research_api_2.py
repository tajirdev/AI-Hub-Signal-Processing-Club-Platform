import os

filepath = 'backend/app/schemas/research.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

target = """from typing import Any
class ResearchAuthorResponse(BaseModel):
    member_id:int
    author_order:int
    member: Optional[Any] = None
    model_config=ConfigDict(from_attributes=True)"""

replacement = """class UserPreview(BaseModel):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    user_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    model_config=ConfigDict(from_attributes=True)

class MemberPreview(BaseModel):
    id: int
    position: Optional[str] = None
    show_profile: Optional[bool] = True
    user: Optional[UserPreview] = None
    model_config=ConfigDict(from_attributes=True)

class ResearchAuthorResponse(BaseModel):
    member_id:int
    author_order:int
    member: Optional[MemberPreview] = None
    model_config=ConfigDict(from_attributes=True)"""

if target in text:
    text = text.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated schema.")
else:
    print("Schema target not found.")

