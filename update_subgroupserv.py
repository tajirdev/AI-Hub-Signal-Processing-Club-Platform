import os

filepath = 'backend/app/services/SubGroupServ.py'
with open(filepath, 'r', encoding='utf-8') as file:
    content = file.read()

replacement = '''
    @staticmethod
    def get_by_slug(slug: str, db: Session):
        from sqlalchemy.orm import joinedload
        group = db.query(SubGroupModel.SubGroup).options(
            joinedload(SubGroupModel.SubGroup.leader),
            joinedload(SubGroupModel.SubGroup.Sub_icon),
            joinedload(SubGroupModel.SubGroup.sub_cover)
        ).filter(SubGroupModel.SubGroup.slug == slug).first()

        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"sub-group with slug {slug} not found"
            )
        return group

    @staticmethod
    def update_group'''

content = content.replace("    @staticmethod\n    def update_group", replacement)

with open(filepath, 'w', encoding='utf-8') as file:
    file.write(content)
