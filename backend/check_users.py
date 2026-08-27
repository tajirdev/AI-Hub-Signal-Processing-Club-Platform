import sys
from app.core.database import SessionLocal
from app.models.ModoleUsers import Users

db = SessionLocal()
users = db.query(Users).all()
for u in users:
    print(f"ID: {u.id}, Name: {u.first_name} {u.last_name}")
