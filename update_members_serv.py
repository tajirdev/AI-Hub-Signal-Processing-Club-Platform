import re

filepath = 'backend/app/services/MembersServ.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add resources initialization
old_init = "news = []\n        events = []\n        blogs = []"
new_init = "news = []\n        events = []\n        blogs = []\n        resources = []"
text = text.replace(old_init, new_init)

# Add resources population loop
old_loop = """            if user.blog_posts:
                for b in user.blog_posts:
                    blogs.append({**{k: v for k, v in b.__dict__.items() if not k.startswith("_")}, "type": "Blog"})"""

new_loop = """            if user.blog_posts:
                for b in user.blog_posts:
                    blogs.append({**{k: v for k, v in b.__dict__.items() if not k.startswith("_")}, "type": "Blog"})
            if user.resource:
                for r in user.resource:
                    resources.append({**{k: v for k, v in r.__dict__.items() if not k.startswith("_")}, "type": "Resource"})"""
text = text.replace(old_loop, new_loop)

# Add to return dictionary
old_return = """            "events": events,
            "blogs": blogs,
            "projects": projects,
            "research": research
        }"""
new_return = """            "events": events,
            "blogs": blogs,
            "projects": projects,
            "research": research,
            "resources": resources
        }"""
text = text.replace(old_return, new_return)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

