import re

filepath = 'backend/app/services/MembersServ.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# For projects (first append)
text = re.sub(
    r'projects\.append\(\{\s*"id": p\.id,\s*"title": p\.title,\s*"description": p\.description,\s*"type": "Project",\s*"status": p\.status\s*\}\)',
    'projects.append({**{k: v for k, v in p.__dict__.items() if not k.startswith("_")}, "type": "Project"})',
    text
)

# For research
text = re.sub(
    r'research\.append\(\{\s*"id": r\.id,\s*"title": r\.title,\s*"description": r\.abstract,\s*"type": "Research",\s*"is_published": r\.is_published\s*\}\)',
    'research.append({**{k: v for k, v in r.__dict__.items() if not k.startswith("_")}, "type": "Research"})',
    text
)

# For news
text = re.sub(
    r'news\.append\(\{"id": n\.id, "title": n\.title, "type": "News"\}\)',
    'news.append({**{k: v for k, v in n.__dict__.items() if not k.startswith("_")}, "type": "News"})',
    text
)

# For events
text = re.sub(
    r'events\.append\(\{"id": e\.id, "title": e\.title, "type": "Event", "status": e\.status\}\)',
    'events.append({**{k: v for k, v in e.__dict__.items() if not k.startswith("_")}, "type": "Event"})',
    text
)

# For blogs
text = re.sub(
    r'blogs\.append\(\{"id": b\.id, "title": b\.title, "type": "Blog"\}\)',
    'blogs.append({**{k: v for k, v in b.__dict__.items() if not k.startswith("_")}, "type": "Blog"})',
    text
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

