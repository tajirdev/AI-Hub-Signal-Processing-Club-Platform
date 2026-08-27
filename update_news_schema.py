import re

filepath = 'backend/app/schemas/news.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add AuthorResponse
if 'class AuthorResponse' not in text:
    author_class = """
class AuthorResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    
    model_config = ConfigDict(from_attributes=True)
"""
    text = text.replace("class NewsResponse(BaseModel):", author_class + "\nclass NewsResponse(BaseModel):")

# Add author/user to NewsResponse
if 'user: Optional[AuthorResponse] = None' not in text:
    text = text.replace(
        "author_id: int",
        "author_id: int\n    user: Optional[AuthorResponse] = None"
    )

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

