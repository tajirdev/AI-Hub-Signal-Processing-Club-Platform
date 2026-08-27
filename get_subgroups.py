import os
import sys

# Add backend to path
sys.path.append(os.path.abspath('backend'))

from app.core.database import SessionLocal
from app.models.SubGroupModel import SubGroup

db = SessionLocal()
subgroups = db.query(SubGroup).all()
print(f"Total subgroups: {len(subgroups)}")
for sg in subgroups:
    print(f"ID: {sg.id}, Name: {sg.name}")
