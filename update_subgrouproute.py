import os

filepath = 'backend/app/routes/SubGroupRoute.py'
with open(filepath, 'r', encoding='utf-8') as file:
    content = file.read()

replacement = '''@router.get("/slug/{slug}", response_model=SubGroupSchm.SubGroupResponse, tags=["SUB GROUPS"])
def return_single_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    return services.get_by_slug(slug, db)


@router.put("/{id}", response_model=SubGroupSchm.SubGroupResponse, tags=["SUB GROUPS"])'''

content = content.replace("@router.put(\"/{id}\", response_model=SubGroupSchm.SubGroupResponse, tags=[\"SUB GROUPS\"])", replacement)

with open(filepath, 'w', encoding='utf-8') as file:
    file.write(content)
