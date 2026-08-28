import re

filepath = 'backend/app/main.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('RouterContact\n)', 'RouterContact,\n    NewsletterRouter\n)')
text = text.replace('app.include_router(RouterContact.router)', 'app.include_router(RouterContact.router)\napp.include_router(NewsletterRouter.router)')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

