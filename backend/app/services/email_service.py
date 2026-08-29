import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

class EmailService:
    @staticmethod
    def send_email(to_email: str, subject: str, body: str, is_html: bool = False):
        if not SENDER_EMAIL or not SENDER_PASSWORD:
            print(f"Skipping email to {to_email}. SMTP credentials not configured.")
            return False
            
        msg = EmailMessage()
        msg['Subject'] = subject
        msg['From'] = SENDER_EMAIL
        msg['To'] = to_email
        
        if is_html:
            msg.set_content(body, subtype='html')
        else:
            msg.set_content(body)
            
        try:
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
                server.starttls()
                server.login(SENDER_EMAIL, SENDER_PASSWORD)
                server.send_message(msg)
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False

    @staticmethod
    def send_otp_email(to_email: str, otp: str, purpose: str):
        subject = "Your Verification Code"
        body = f"Your one-time password (OTP) for {purpose} is: {otp}\nThis code will expire in 10 minutes."
        return EmailService.send_email(to_email, subject, body)

    @staticmethod
    def send_application_approved_email(to_email: str, first_name: str, otp: str):
        import urllib.parse
        
        # Try to get FRONTEND_URL. If it's missing (because docker-compose doesn't pass it), 
        # fallback to the first CORS origin which is the frontend URL.
        frontend_url = os.getenv("FRONTEND_URL")
        if not frontend_url:
            cors_origins = os.getenv("CORS_ORIGINS", "")
            if cors_origins:
                frontend_url = cors_origins.split(",")[0].strip()
            else:
                frontend_url = "http://localhost:5174"
                
        encoded_email = urllib.parse.quote(to_email)
        magic_link = f"{frontend_url}/onboard?email={encoded_email}&otp={otp}"
        
        subject = "Application Approved - AI & Signal Processing Hub"
        body = f"""Hello {first_name},

Congratulations! Your application to the AI & Signal Processing Hub has been approved.

Please click the secure link below to complete your onboarding and set up your member profile. 
This link will expire in 3 days.
{magic_link}

If the link above does not work, please contact our IT support onboard@signia.com

Welcome to the Hub!

Best regards,
AI & Signal Processing Hub Team"""
        return EmailService.send_email(to_email, subject, body)

    @staticmethod
    def send_application_rejected_email(to_email: str, first_name: str):
        subject = "Application Update - AI & Signal Processing Hub"
        body = f"Hello {first_name},\n\nThank you for applying to the AI & Signal Processing Hub. Unfortunately, we are unable to accept your application at this time.\n\nBest regards,\nThe Team"
        return EmailService.send_email(to_email, subject, body)
