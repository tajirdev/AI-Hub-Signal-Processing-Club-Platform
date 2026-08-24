import os
import sys

# Ensure backend is in pythonpath
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.models.otp import OTP
from app.models.applicationModel import Application, ApplicationStatus
from app.models.ModoleUsers import Users

client = TestClient(app)

# Login admin to get token for some routes
admin_token = client.post("/login", data={"username": "admin@test.com", "password": "Password123!"}).json()["access_token"]
headers_admin = {"Authorization": f"Bearer {admin_token}"}

report = ["# Phase 5: New Features Test Report\n"]
def run_test(name, func):
    try:
        status, details = func()
        mark = "?" if status else "?"
        report.append(f"- {mark} **{name}**: {details}")
    except Exception as e:
        report.append(f"- ? **{name}**: Crash - {str(e)}")

db = SessionLocal()

def test_password_reset_flow():
    # 1. Request Reset
    res = client.post("/password-reset/request", json={"email": "admin@test.com"})
    if res.status_code != 200:
        return False, f"Failed to request reset: {res.text}"
        
    # 2. Get OTP from DB
    otp = db.query(OTP).filter(OTP.email == "admin@test.com", OTP.purpose == "password_reset").order_by(OTP.id.desc()).first()
    if not otp:
        return False, "OTP not created in DB."
        
    # 3. Confirm Reset
    res = client.post("/password-reset/confirm", json={"email": "admin@test.com", "otp_code": otp.otp_code, "new_password": "NewPassword123!"})
    if res.status_code != 200:
        return False, f"Failed to confirm reset: {res.text}"
        
    # 4. Try Login with new password
    res = client.post("/login", data={"username": "admin@test.com", "password": "NewPassword123!"})
    if res.status_code != 200:
        return False, "Failed to login with new password."
        
    # Revert password back so other things don't break
    client.post("/password-reset/request", json={"email": "admin@test.com"})
    otp = db.query(OTP).filter(OTP.email == "admin@test.com", OTP.purpose == "password_reset").order_by(OTP.id.desc()).first()
    client.post("/password-reset/confirm", json={"email": "admin@test.com", "otp_code": otp.otp_code, "new_password": "Password123!"})
    return True, "Password reset workflow successfully verified."

def test_onboarding_flow():
    # 1. Create Application
    res = client.post("/application/", json={
        "first_name": "Applicant",
        "last_name": "Test",
        "registration_number": 99999,
        "programme": "AI",
        "year": 1,
        "email": "applicant@test.com",
        "phone": 12345678,
        "motivation": "I love AI"
    })
    if res.status_code != 200:
        return False, f"Failed to create application: {res.text}"
    app_id = res.json()["id"]
    
    # 2. Approve Application
    res = client.put(f"/application/{app_id}", json={"status": "approved"}, headers=headers_admin)
    if res.status_code != 200:
        return False, f"Failed to approve application: {res.text}"
        
    # 3. Get OTP from DB
    otp = db.query(OTP).filter(OTP.email == "applicant@test.com", OTP.purpose == "registration").order_by(OTP.id.desc()).first()
    if not otp:
        return False, "OTP not created for onboarding in DB."
        
    # 4. Complete Onboarding
    res = client.post("/application/onboarding", json={
        "email": "applicant@test.com",
        "otp_code": otp.otp_code,
        "password": "ApplicantPassword123!",
        "user_name": "applicant123",
        "subgroup_id": 1,
        "bio": "I am an applicant."
    })
    if res.status_code != 200:
        return False, f"Failed to complete onboarding: {res.text}"
        
    # 5. Check Login
    res = client.post("/login", data={"username": "applicant@test.com", "password": "ApplicantPassword123!"})
    if res.status_code != 200:
        return False, "Failed to login as new member."
    
    return True, "Member onboarding flow successfully verified."
    
def test_editor_promotion():
    # Get user_id of the applicant we just created
    user = db.query(Users).filter(Users.email == "applicant@test.com").first()
    if not user:
        return False, "Onboarded user not found in DB."
        
    # Promote to editor
    res = client.post("/users/promote", json={"user_id": user.id, "role_name": "editor"}, headers=headers_admin)
    if res.status_code != 200:
        return False, f"Failed to promote: {res.text}"
        
    return True, "Promotion workflow successfully verified."

run_test("Password Reset Flow", test_password_reset_flow)
run_test("Application Onboarding Flow", test_onboarding_flow)
run_test("Editor Promotion Flow", test_editor_promotion)

db.close()

with open("phase5_report.md", "w", encoding="utf-8") as f:
    f.write("\n".join(report))

print("Phase 5 Tests completed.")
