import re

filepath = 'frontend/src/services/endpoints.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Update uploadContentMedia routing
old_upload = """  let endpoint = `/${type}/${id}/cover`;
  if (type === 'research') endpoint = `/${type}/${id}/file`;
  if (type === 'blog-posts') endpoint = `/${type}/${id}`; // Backend specific"""

new_upload = """  let endpoint = `/${type}/${id}/cover`;
  if (type === 'research') endpoint = `/${type}/${id}/file`;
  if (type === 'resources') endpoint = `/${type}/${id}/file`;
  if (type === 'blog-posts') endpoint = `/${type}/${id}`; // Backend specific"""

text = text.replace(old_upload, new_upload)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
