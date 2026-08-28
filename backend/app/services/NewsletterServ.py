from sqlalchemy.orm import Session
from app.models.ModelNewsletter import NewsletterSubscribers
from app.schemas.NewsletterSchm import SubscriberCreate

def subscribe(subscriber_data: SubscriberCreate, db: Session):
    # Check if exists
    existing = db.query(NewsletterSubscribers).filter(
        NewsletterSubscribers.email == subscriber_data.email
    ).first()

    if existing:
        if not existing.is_active:
            existing.is_active = True
            db.commit()
            return {"message": "Welcome back! Your subscription has been reactivated.", "is_new": False}
        return {"message": "You are already subscribed to our newsletter.", "is_new": False}
    
    # Create new
    new_sub = NewsletterSubscribers(email=subscriber_data.email)
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    
    return {"message": "Successfully subscribed to the newsletter!", "is_new": True}

def get_subscribers(db: Session):
    return db.query(NewsletterSubscribers).order_by(NewsletterSubscribers.created_at.desc()).all()
