import re

filepath = 'backend/app/models/__init__.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('from .ModelContact import Contact', 'from .ModelContact import Contact\nfrom .ModelNewsletter import NewsletterSubscribers')
text = text.replace('"Contact"]', '"Contact", "NewsletterSubscribers"]')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

