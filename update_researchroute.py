import os

filepath = 'backend/app/routes/research.py'
with open(filepath, 'r', encoding='utf-8') as file:
    content = file.read()

replacement = '''@router.get("/", response_model=list[ResearchResponse])
def show_all(
    db: Session = Depends(get_db),
    current_user: Optional[Users] = Depends(get_optional_current_user),
    page: int = 1,
    search: Optional[str] = None,
    limit: int = 10,
    title: Optional[str] = None,
    sort: str = "publication_date",
    order: str = "desc",
    subgroup_id: Optional[int] = None
):
    return ResearchServices.show_all(db, current_user, page, search, limit, title, sort, order, subgroup_id)'''

content = content.replace('''@router.get("/", response_model=list[ResearchResponse])
def show_all(
    db: Session = Depends(get_db),
    current_user: Optional[Users] = Depends(get_optional_current_user),
    page: int = 1,
    search: Optional[str] = None,
    limit: int = 10,
    title: Optional[str] = None,
    sort: str = "publication_date",
    order: str = "desc"
):
    return ResearchServices.show_all(db, current_user, page, search, limit, title, sort, order)''', replacement)

with open(filepath, 'w', encoding='utf-8') as file:
    file.write(content)
