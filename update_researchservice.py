import os

filepath = 'backend/app/services/research.py'
with open(filepath, 'r', encoding='utf-8') as file:
    content = file.read()

replacement = '''    @staticmethod
    def show_all(db: Session, current_user,
                 page: int = 1, search: str = None,
                 limit: int = 10, title: str = None,
                 sort: str = "publication_date",
                 order: str = "desc",
                 subgroup_id: int = None):
        query = db.query(Research).options(joinedload(Research.authors).joinedload(ResearchAuthor.member))
        
        if subgroup_id:
            query = query.join(ResearchAuthor).join(Members).filter(Members.subgroup_id == subgroup_id)
'''

content = content.replace('''    @staticmethod
    def show_all(db: Session, current_user,
                 page: int = 1, search: str = None,
                 limit: int = 10, title: str = None,
                 sort: str = "publication_date",
                 order: str = "desc"):''', replacement)

with open(filepath, 'w', encoding='utf-8') as file:
    file.write(content)
