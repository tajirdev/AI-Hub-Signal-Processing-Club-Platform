from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.ModoleUsers import Users
from app.services.otp_service import OTPService
from app.core import security

class PasswordResetService:
    @staticmethod
    def request_reset(email: str, db: Session):
        user = db.query(Users).filter(Users.email == email).first()
        if not user:
            # For security, do not expose if email exists
            return {"message": "If that email is registered, you will receive an OTP shortly."}
            
        OTPService.create_and_send_otp(db, email, "password_reset")
        return {"message": "If that email is registered, you will receive an OTP shortly."}

    @staticmethod
    def confirm_reset(email: str, otp_code: str, new_password: str, db: Session):
        is_valid = OTPService.verify_otp(db, email, otp_code, "password_reset")
        if not is_valid:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP.")
            
        user = db.query(Users).filter(Users.email == email).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
            
        user.password_hash = security.Hash.hash(new_password)
        db.commit()
        
        return {"message": "Password successfully reset."}
