import os

filepath = 'backend/app/services/project_service.py'
with open(filepath, 'r', encoding='utf-8') as file:
    content = file.read()

replacement = '''    @staticmethod
    def get_projects(db: Session, page: int = 1, limit: int = 10, search: Optional[str] = None, sort: Optional[str] = "created_at", order: Optional[str] = "desc", subgroup_id: Optional[int] = None):
        query = db.query(Project)
        
        if subgroup_id:
            from app.models.SubGroupModel import SubGroup
            query = query.join(SubGroup, SubGroup.lead_id == Project.created_by).filter(SubGroup.id == subgroup_id)
            
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                (Project.title.ilike(search_filter)) |
                (Project.description.ilike(search_filter)) |
                (Project.technology_stack.ilike(search_filter))
            )'''

content = content.replace('''    @staticmethod
    def get_projects(db: Session, page: int = 1, limit: int = 10, search: Optional[str] = None, sort: Optional[str] = "created_at", order: Optional[str] = "desc"):
        query = db.query(Project)
        
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                (Project.title.ilike(search_filter)) |
                (Project.description.ilike(search_filter)) |
                (Project.technology_stack.ilike(search_filter))
            )''', replacement)

with open(filepath, 'w', encoding='utf-8') as file:
    file.write(content)
