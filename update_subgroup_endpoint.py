import re

filepath = 'frontend/src/services/endpoints.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("api.get('/sub-groups')", "api.get('/sub_groups')")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

