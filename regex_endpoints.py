import re
import os

filepath = 'frontend/src/services/endpoints.js'
with open(filepath, 'r', encoding='utf-8') as file:
    content = file.read()

content = re.sub(r'api\.get\(/projects/\);', r'api.get(/projects/);', content)
content = re.sub(r'api\.get\(/sub_groups/slug/\);', r'api.get(/sub_groups/slug/);', content)

with open(filepath, 'w', encoding='utf-8') as file:
    file.write(content)
