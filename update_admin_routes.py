import re

filepath = 'admin/src/routes.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

if "Newsletter:" not in text:
    text = text.replace("Profile: { path: \"/profile\" },", "Newsletter: { path: \"/newsletter\" },\n  Profile: { path: \"/profile\" },")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

