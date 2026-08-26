from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.ModelContact import Contact
from app.schemas.schemaContact import ContactCreate, ContactUpdate

class ContactService:
    @staticmethod
    def create_contact(request: ContactCreate, db: Session):
        new_contact = Contact(
            name=request.name,
            email=request.email,
            subject=request.subject,
            message=request.message,
            status="pending"
        )
        db.add(new_contact)
        db.commit()
        db.refresh(new_contact)
        return new_contact

    @staticmethod
    def get_all_contacts(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Contact).offset(skip).limit(limit).all()

    @staticmethod
    def get_contact_by_id(id: int, db: Session):
        contact = db.query(Contact).filter(Contact.id == id).first()
        if not contact:
            raise HTTPException(status_code=404, detail="Contact message not found")
        return contact

    @staticmethod
    def update_contact_status(id: int, request: ContactUpdate, db: Session):
        contact = db.query(Contact).filter(Contact.id == id).first()
        if not contact:
            raise HTTPException(status_code=404, detail="Contact message not found")
        
        contact.status = request.status
        db.commit()
        db.refresh(contact)
        return contact

    @staticmethod
    def delete_contact(id: int, db: Session):
        contact = db.query(Contact).filter(Contact.id == id).first()
        if not contact:
            raise HTTPException(status_code=404, detail="Contact message not found")
        
        db.delete(contact)
        db.commit()
        return {"detail": "Contact message deleted successfully"}
