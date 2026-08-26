from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.schemaContact import ContactCreate, ContactUpdate, ContactOut
from app.services.ContactService import ContactService
from app.core.RoleAuth import RoleChecker
from app.models import ModoleUsers

admin_required = RoleChecker(["super_admin"])
service = ContactService

router = APIRouter(
    tags=["CONTACT"],
    prefix="/contact"
)

@router.post("/", response_model=ContactOut, status_code=status.HTTP_201_CREATED)
def create_contact_message(
    request: ContactCreate,
    db: Session = Depends(get_db)
):
    """Public endpoint to submit a contact message."""
    return service.create_contact(request, db)

@router.get("/", response_model=List[ContactOut])
def get_all_contacts(
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db),
    current_user: ModoleUsers.Users = Depends(admin_required)
):
    """Super Admin endpoint to list all contact messages."""
    return service.get_all_contacts(db, skip=skip, limit=limit)

@router.get("/{id}", response_model=ContactOut)
def get_contact_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: ModoleUsers.Users = Depends(admin_required)
):
    """Super Admin endpoint to get a specific contact message."""
    return service.get_contact_by_id(id, db)

@router.put("/{id}/status", response_model=ContactOut)
def update_contact_status(
    id: int,
    request: ContactUpdate,
    db: Session = Depends(get_db),
    current_user: ModoleUsers.Users = Depends(admin_required)
):
    """Super Admin endpoint to update the status of a message."""
    return service.update_contact_status(id, request, db)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(
    id: int,
    db: Session = Depends(get_db),
    current_user: ModoleUsers.Users = Depends(admin_required)
):
    """Super Admin endpoint to delete a contact message."""
    return service.delete_contact(id, db)
