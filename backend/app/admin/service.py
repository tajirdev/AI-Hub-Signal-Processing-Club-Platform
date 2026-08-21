from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models import ModoleRoles,ModoleUsers,ModelUserRoles


class AdminService:

    @staticmethod
    def CreateAdmin(user_id: int, db: Session):
        # 1. Fetch user
        user = (
            db.query(ModoleUsers.Users)
            .filter(ModoleUsers.Users.id == user_id)
            .first()
        )
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found",
            )

        
        super_admin_role = (
            db.query(ModoleRoles.Role)
            .filter(ModoleRoles.Role.name == "super_admin")
            .first()
        )
        if not super_admin_role:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="super_admin role is not defined in database",
            )

      
        user_role = (
            db.query(ModelUserRoles.UserRole)
            .filter(ModelUserRoles.UserRole.user_id == user.id)
            .first()
        )

        
        if user_role:
            if user_role.role_id == super_admin_role.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User is already an admin",
                )
           
            user_role.role_id = super_admin_role.id
        else:
           
            user_role = ModelUserRoles.UserRole(
                user_id=user.id, role_id=super_admin_role.id
            )
            db.add(user_role)

        db.commit()
        db.refresh(user_role)

        return {"message": "User successfully promoted to super_admin"}




    @staticmethod
    def RemoveAdmin(user_id: int, db: Session):
        # 1. Fetch user
        user = (
            db.query(ModoleUsers.Users)
            .filter(ModoleUsers.Users.id == user_id)
            .first()
        )
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found",
            )


        member_role = (
            db.query(ModoleRoles.Role)
            .filter(ModoleRoles.Role.name == "member")
            .first()
        )
        if not member_role:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="member role is not defined in database",
            )


        user_role = (
            db.query(ModelUserRoles.UserRole)
            .filter(ModelUserRoles.UserRole.user_id == user.id)
            .first()
        )

    
        if user_role:
            if user_role.role_id == member_role.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User is already a regular member",
                )
        
            user_role.role_id = member_role.id
        else:
        
            user_role = ModelUserRoles.UserRole(
                user_id=user.id, role_id=member_role.id
            )
            db.add(user_role)

        db.commit()
        db.refresh(user_role)

        return {"message": "User successfully demoted to member"}




        