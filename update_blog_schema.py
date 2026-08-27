import os

filepath = 'backend/app/schemas/blog_post.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

target = """class BlogPostResponse(BaseModel):
    id:int"""

replacement = """class UserPreview(BaseModel):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    user_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    model_config=ConfigDict(from_attributes=True)

class BlogPostResponse(BaseModel):
    id:int
    author:Optional[UserPreview]=None"""

if target in text:
    text = text.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated schema.")
else:
    print("Target not found.")

