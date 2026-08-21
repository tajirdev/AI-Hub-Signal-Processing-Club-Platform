"""
CLI utility to create or promote a Super Admin user.
Usage:
    python create_admin.py --email admin@example.com --password YourPassword --first_name Admin --last_name User --username adminuser
"""

import argparse
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.ModoleUsers import Users
from app.models.ModoleRoles import Role
from app.models.ModelUserRoles import UserRole
from app.core import security

def create_or_promote_admin(email, password, first_name="Super", last_name="Admin", username=None):
    db: Session = SessionLocal()
    try:
        # Ensure super_admin role exists
        admin_role = db.query(Role).filter(Role.name == "super_admin").first()
        if not admin_role:
            admin_role = Role(name="super_admin", description="Full system access.")
            db.add(admin_role)
            db.commit()
            db.refresh(admin_role)

        if not username:
            username = email.split("@")[0]

        user = db.query(Users).filter(Users.email == email).first()
        if not user:
            user = Users(
                first_name=first_name,
                last_name=last_name,
                user_name=username,
                email=email,
                password_hash=security.Hash.hash(password),
                phone="+255000000000",
                bio="Super Administrator",
                is_active=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created new user: {email} (ID: {user.id})")
        else:
            if password:
                user.password_hash = security.Hash.hash(password)
            user.is_active = True
            db.commit()
            print(f"Found existing user: {email} (ID: {user.id}). Updated password and activated account.")

        # Ensure user has super_admin role
        has_role = (
            db.query(UserRole)
            .filter(UserRole.user_id == user.id, UserRole.role_id == admin_role.id)
            .first()
        )
        if not has_role:
            db.add(UserRole(user_id=user.id, role_id=admin_role.id))
            db.commit()
            print(f"Assigned 'super_admin' role to {email}.")
        else:
            print(f"User {email} already has 'super_admin' role.")

        print(f"\n[SUCCESS] Super Admin account is ready!")
        print(f"Email:    {email}")
        print(f"Password: {password if password else '(unchanged)'}\n")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed to create admin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create or promote a Super Admin user")
    parser.add_argument("--email", default="admin@must.ac.tz", help="Admin email address")
    parser.add_argument("--password", default="Admin123!", help="Admin password")
    parser.add_argument("--first_name", default="Super", help="First name")
    parser.add_argument("--last_name", default="Admin", help="Last name")
    parser.add_argument("--username", default=None, help="Username (defaults to email handle)")

    args = parser.parse_args()
    create_or_promote_admin(
        email=args.email,
        password=args.password,
        first_name=args.first_name,
        last_name=args.last_name,
        username=args.username,
    )
