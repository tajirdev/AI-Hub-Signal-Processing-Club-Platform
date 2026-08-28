import re

filepath = 'frontend/src/features/members/components/ManageContentTab.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add FileArchive to lucide-react imports if not there
if 'FileArchive' not in text:
    text = text.replace('Trash2, Plus, Loader2', 'Trash2, Plus, Loader2, FileArchive')

# Add resources category
old_cat = """    { id: "blogs", label: "Blogs", icon: FileText, data: profile.blogs || [], endpoint: 'blog-posts' },
  ];"""
new_cat = """    { id: "blogs", label: "Blogs", icon: FileText, data: profile.blogs || [], endpoint: 'blog-posts' },
    { id: "resources", label: "Resources", icon: FileArchive, data: profile.resources || [], endpoint: 'resources' },
  ];"""
text = text.replace(old_cat, new_cat)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
