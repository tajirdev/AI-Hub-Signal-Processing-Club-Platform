import os

filepath = 'backend/app/services/blog_post_services.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add joinedload import if missing
if 'joinedload' not in text:
    text = 'from sqlalchemy.orm import joinedload\n' + text

text = text.replace(
    'post=db.query(BlogPost).filter(BlogPost.id==post_id).first()',
    'post=db.query(BlogPost).options(joinedload(BlogPost.author)).filter(BlogPost.id==post_id).first()'
)

text = text.replace(
    'query=db.query(BlogPost)',
    'query=db.query(BlogPost).options(joinedload(BlogPost.author))'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

