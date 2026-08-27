import os

filepath_serv = 'backend/app/services/research.py'
with open(filepath_serv, 'r', encoding='utf-8') as f:
    text_serv = f.read()

target_serv_1 = """        query = db.query(Research).options(
            joinedload(Research.file),
            joinedload(Research.authors).joinedload(ResearchAuthor.member)
        )"""
replacement_serv_1 = """        query = db.query(Research).options(
            joinedload(Research.file),
            joinedload(Research.authors).joinedload(ResearchAuthor.member).joinedload(Members.user)
        )"""

target_serv_2 = """        research = db.query(Research).options(
            joinedload(Research.file),
            joinedload(Research.authors)
        ).filter(Research.id == research_id).first()"""
replacement_serv_2 = """        research = db.query(Research).options(
            joinedload(Research.file),
            joinedload(Research.authors).joinedload(ResearchAuthor.member).joinedload(Members.user)
        ).filter(Research.id == research_id).first()"""

if target_serv_1 in text_serv:
    text_serv = text_serv.replace(target_serv_1, replacement_serv_1)
if target_serv_2 in text_serv:
    text_serv = text_serv.replace(target_serv_2, replacement_serv_2)

# Make sure Members is imported if not already.
if "from app.models.ModoleMembers import Members" not in text_serv:
    text_serv = "from app.models.ModoleMembers import Members\n" + text_serv

with open(filepath_serv, 'w', encoding='utf-8') as f:
    f.write(text_serv)
print("Updated services.")

