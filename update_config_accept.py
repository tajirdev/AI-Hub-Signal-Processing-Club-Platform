import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Update fields
text = text.replace(
    '{ name: "cover_image", label: "Cover Image", type: "file" }',
    '{ name: "cover_image", label: "Cover Image", type: "file", accept: "image/*" }'
)
text = text.replace(
    '{ name: "cover_image", label: "Cover Image / Document", type: "file" }',
    '{ name: "cover_image", label: "Cover Image / Document", type: "file", accept: "image/*,application/pdf" }'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

