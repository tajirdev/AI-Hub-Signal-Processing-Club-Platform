import random
import string
from datetime import datetime, timedelta, timezone
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models.otp import OTP
from app.services.email_service import EmailService
from app.models.applicationModel import Application
from app.core import security

class OTPService:
    @staticmethod
    def generate_otp(length=6):
        return ''.join(random.choices(string.digits, k=length))

    @staticmethod
    def create_and_send_otp(db: Session, email: str, purpose: str, expires_in_minutes: int = 15):
        clean_email = (email or "").strip().lower()
        if not clean_email:
            return False

        # Invalidate previous unused OTPs for this email and purpose
        db.query(OTP).filter(
            func.lower(OTP.email) == clean_email,
            OTP.purpose == purpose,
            OTP.is_used == False
        ).update({"is_used": True}, synchronize_session=False)

        plain_otp = OTPService.generate_otp(6)
        hashed_otp = security.Hash.hash(plain_otp)
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=expires_in_minutes)

        new_otp = OTP(
            email=clean_email,
            otp_code=hashed_otp,
            purpose=purpose,
            expires_at=expires_at,
            is_used=False
        )
        db.add(new_otp)
        db.commit()

        if purpose == "registration":
            app = db.query(Application).filter(func.lower(Application.email) == clean_email).first()
            first_name = app.first_name if app else "Applicant"
            EmailService.send_application_approved_email(email.strip(), first_name, plain_otp)
        else:
            EmailService.send_otp_email(email.strip(), plain_otp, purpose)
        return True

    @staticmethod
    def verify_otp(db: Session, email: str, otp_code: str, purpose: str):
        clean_email = (email or "").strip().lower()
        clean_otp = str(otp_code or "").strip()

        if not clean_email or not clean_otp:
            return False

        # Retrieve active unused OTP records for this email and purpose
        candidates = db.query(OTP).filter(
            func.lower(OTP.email) == clean_email,
            OTP.purpose == purpose,
            OTP.is_used == False
        ).order_by(OTP.id.desc()).all()

        now_utc = datetime.now(timezone.utc)
        matched_record = None

        for record in candidates:
            # Check expiration
            exp = record.expires_at
            if exp.tzinfo is None:
                exp = exp.replace(tzinfo=timezone.utc)

            if exp < now_utc:
                record.is_used = True
                continue

            # Verify hashed OTP (with fallback for legacy unhashed codes)
            is_valid = False
            try:
                is_valid = security.Hash.verify_password(clean_otp, record.otp_code)
            except Exception:
                is_valid = (record.otp_code == clean_otp)

            if is_valid:
                matched_record = record
                break

        if matched_record:
            matched_record.is_used = True
            db.commit()
            return True

        db.commit()
        return False
