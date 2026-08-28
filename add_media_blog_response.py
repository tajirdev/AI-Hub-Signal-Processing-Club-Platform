import re

filepath = 'backend/app/schemas/blog_post.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add MediaResponse schema
media_schema = """
class MediaResponse(BaseModel):
    id: int
    path: str
    
    model_config = ConfigDict(from_attributes=True)
"""

if "class MediaResponse" not in text:
    text = text.replace("class UserPreview(BaseModel):", media_schema + "\nclass UserPreview(BaseModel):")

# Add media field to BlogPostResponse
if "media: Optional[MediaResponse] = None" not in text:
    text = text.replace(
        "featured_image_id:Optional[int]",
        "featured_image_id:Optional[int]\n    media:Optional[MediaResponse]=None"
    )

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

