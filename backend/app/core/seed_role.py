from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException, status
from .database import get_db
from app.models.ModoleRoles import Role
from app.core.auth import get_optional_current_user

router = APIRouter(tags=["Seed"])


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
def seed_roles(
    db: Session = Depends(get_db),
    current_user = Depends(get_optional_current_user)
):
    existing_roles_count = db.query(Role).count()

    # If roles already exist in the database, require super_admin privileges
    if existing_roles_count > 0:
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required to run database seeding on an initialized database."
            )
        user_roles = {ur.Roles.name for ur in current_user.userRole if ur.Roles}
        if "super_admin" not in user_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only super_admin can perform database seeding."
            )

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