import os

filepath = 'backend/app/routes/project.py'
with open(filepath, 'r', encoding='utf-8') as file:
    content = file.read()

replacement = '''def get_all_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    sort: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    subgroup_id: Optional[int] = Query(None, description="Filter by subgroup ID"),
    db: Session = Depends(get_db)
):
    return ProjectService.get_projects(db,page,limit,search,sort,order,subgroup_id)'''

content = content.replace('''def get_all_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    sort: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    db: Session = Depends(get_db)
):
    return ProjectService.get_projects(db,page,limit,search,sort,order)''', replacement)

with open(filepath, 'w', encoding='utf-8') as file:
    file.write(content)
