from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.onboardingSchm import ApplicationOnboarding
from app.models.applicationModel import Application, ApplicationStatus
from app.models.ModoleUsers import Users
from app.models.ModoleRoles import Role
from app.models.ModelUserRoles import UserRole
from app.models.ModoleMembers import Members
from app.models.SubGroupModel import SubGroup
from app.services.otp_service import OTPService
from app.core import security

class OnboardingService:
    @staticmethod
    def complete_onboarding(request: ApplicationOnboarding, db: Session):
        from sqlalchemy import func
        clean_email = (request.email or "").strip().lower()

        # 1. Verify OTP
        is_valid = OTPService.verify_otp(db, clean_email, request.otp_code, "registration")
        if not is_valid:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP.")
            
        # 2. Verify Application is Approved
        app = db.query(Application).filter(func.lower(Application.email) == clean_email).first()
        if not app or app.status != ApplicationStatus.approved:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Application not approved or found.")
            
        # 3. Verify Subgroup exists
        subgroup = db.query(SubGroup).filter(SubGroup.id == request.subgroup_id).first()
        if not subgroup:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subgroup not found.")

        # 4. Check if user already exists
        existing_user = db.query(Users).filter(func.lower(Users.email) == clean_email).first()
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already registered.")

        # 5. Create User
        new_user = Users(
            first_name=app.first_name,
            last_name=app.last_name,
            email=clean_email,
            password_hash=security.Hash.hash(request.password),
            phone=app.phone,
            bio=request.bio or "",
            user_name=request.user_name,
            is_active=True
        )
        db.add(new_user)
        db.flush()

        # 6. Assign Member Role
        member_role = db.query(Role).filter(Role.name == "member").first()
        if not member_role:
            member_role = Role(name="member")
            db.add(member_role)
            db.flush()
            
        user_role = UserRole(user_id=new_user.id, role_id=member_role.id)
        db.add(user_role)
        db.flush()

        # 7. Create Member Record
        new_member = Members(
            user_id=new_user.id,
            subgroup_id=request.subgroup_id,
            position="member",
            github=request.github,
            linkedin=request.linkedin,
            portfolio=request.portfolio,
            show_profile=True
        )
        db.add(new_member)
        db.commit()

        return {"message": "Onboarding complete. You can now log in."}
