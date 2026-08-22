import random
import string
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.otp import OTP
from app.services.email_service import EmailService
from app.models.applicationModel import Application

class OTPService:
    @staticmethod
    def generate_otp(length=6):
        return ''.join(random.choices(string.digits, k=length))

    @staticmethod
    def create_and_send_otp(db: Session, email: str, purpose: str, expires_in_minutes: int = 15):
        # Invalidate previous OTPs
        db.query(OTP).filter(OTP.email == email, OTP.purpose == purpose, OTP.is_used == False).update({"is_used": True})
        
        otp_code = OTPService.generate_otp()
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=expires_in_minutes)
        
        new_otp = OTP(email=email, otp_code=otp_code, purpose=purpose, expires_at=expires_at)
        db.add(new_otp)
        db.commit()
        
        if purpose == "registration":
            app = db.query(Application).filter(Application.email == email).first()
            first_name = app.first_name if app else "Applicant"
            EmailService.send_application_approved_email(email, first_name, otp_code)
        else:
            EmailService.send_otp_email(email, otp_code, purpose)
        return True

    @staticmethod
    def verify_otp(db: Session, email: str, otp_code: str, purpose: str):
        otp = db.query(OTP).filter(
            OTP.email == email,
            OTP.otp_code == otp_code,
            OTP.purpose == purpose,
            OTP.is_used == False,
            OTP.expires_at > datetime.now(timezone.utc)
        ).first()
        
        if not otp:
            return False
            
        otp.is_used = True
        db.commit()
        return True
