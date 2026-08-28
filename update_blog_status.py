import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

old_blog_field = '{ name: "is_published", label: "Published?", type: "checkbox", default: false },'
new_blog_field = '{ name: "status", label: "Status", type: "select", options: ["draft", "published"], default: "draft" },'

text = text.replace(old_blog_field, new_blog_field)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

