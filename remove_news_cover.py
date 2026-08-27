import re

filepath = 'frontend/src/features/members/components/ContentFormModal.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Remove cover_image from News config
text = text.replace(
    '{ name: "status", label: "Status", type: "select", options: ["draft", "published"], default: "draft" },\n      { name: "cover_image", label: "Cover Image", type: "file" }',
    '{ name: "status", label: "Status", type: "select", options: ["draft", "published"], default: "draft" }'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

