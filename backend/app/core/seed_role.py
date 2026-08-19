from sqlalchemy.orm import Session
from fastapi import Depends
from .database import get_db

from app.models.ModoleRoles import Role
from fastapi import APIRouter

router = APIRouter()


DEFAULT_ROLES = [
    {
        "name": "super_admin",
        "description": "Full system access."
    },
    {
        "name": "editor",
        "description": "Can manage and publish content."
    },
    {
        "name": "member",
        "description": "Default club member."
    },
]

@router.post("/db")
def seed_roles(db: Session=Depends(get_db)):
    added_any = False
    for role_data in DEFAULT_ROLES:
        exists = (
            db.query(Role)
            .filter(Role.name == role_data["name"])
            .first()
        )

        if not exists:
            db.add(Role(**role_data))
            added_any = True

    db.commit()

    if added_any:
        return {"message": "Roles seeded successfully"}

    return {"message": "seed already planted"}