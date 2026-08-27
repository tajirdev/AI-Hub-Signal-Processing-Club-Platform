import re

filepath = 'frontend/src/services/endpoints.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace all broken syntax
text = text.replace('api.get(/projects/)', 'api.get(/projects/)')
text = text.replace('api.get(/sub_groups/slug/)', 'api.get(/sub_groups/slug/)')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
