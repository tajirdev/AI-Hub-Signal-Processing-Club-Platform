from fastapi import Depends, HTTPException, status

from .auth import get_current_user
from app.models.ModoleUsers import Users


class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = set(allowed_roles)

    def __call__(
        self,
        current_user: Users = Depends(get_current_user)
    ) -> Users:

        
        user_roles = {user_role.Roles.name for user_role in current_user.userRole}

        # Super Admin bypass
        if "super_admin" in user_roles:
            return current_user

        if not user_roles.intersection(self.allowed_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action."
            )

        return current_user