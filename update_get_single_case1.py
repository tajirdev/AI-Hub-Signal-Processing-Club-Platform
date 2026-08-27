import re

filepath = 'backend/app/services/MembersServ.py'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# We need to import Project from app.models.project to query it if we want to fetch projects by lead_id.
# Let's see if Project is already imported or available.
# It's better to just do db.query(Project) or we can use the user object if lead_id maps to a User.
# Actually we can do `if member.subgroup and member.subgroup.leader: for p in member.subgroup.leader.project:` !

old_projects_logic = """        projects = []
        if user.project:
            for p in user.project:
                if p.status == "active" or is_owner:
                    projects.append({
                        "id": p.id,
                        "title": p.title,
                        "description": p.description,
                        "type": "Project",
                        "status": p.status
                    })"""

new_projects_logic = """        projects = []
        # Projects: If member is in a subgroup, get projects from the subgroup leader
        if member.subgroup and member.subgroup.leader:
            for p in member.subgroup.leader.project:
                if p.status == "active" or is_owner:
                    projects.append({
                        "id": p.id,
                        "title": p.title,
                        "description": p.description,
                        "type": "Project",
                        "status": p.status
                    })
        # Alternatively, if they have personal projects, we might add them too
        if user.project:
            for p in user.project:
                if p.status == "active" or is_owner:
                    # Prevent duplicates
                    if not any(proj['id'] == p.id for proj in projects):
                        projects.append({
                            "id": p.id,
                            "title": p.title,
                            "description": p.description,
                            "type": "Project",
                            "status": p.status
                        })"""

old_research_logic = """        research = []
        if user.research:
            for r in user.research:
                if r.is_published or is_owner:
                    research.append({
                        "id": r.id,
                        "title": r.title,
                        "description": r.abstract,
                        "type": "Research",
                        "is_published": r.is_published
                    })"""

new_research_logic = """        research = []
        # Research: The member is an author
        if member.research_authors:
            for ra in member.research_authors:
                r = ra.research
                if r and (r.is_published or is_owner):
                    research.append({
                        "id": r.id,
                        "title": r.title,
                        "description": r.abstract,
                        "type": "Research",
                        "is_published": r.is_published
                    })"""

text = text.replace(old_projects_logic, new_projects_logic)
text = text.replace(old_research_logic, new_research_logic)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

