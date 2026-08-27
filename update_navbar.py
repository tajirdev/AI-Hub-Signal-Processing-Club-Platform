import os

filepath = 'frontend/src/components/layout/Navbar.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "{ label: 'Blog / News', href: '/blog' },",
    "{ label: 'Blog', href: '/blog' },\n        { label: 'News', href: '/news' },"
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

