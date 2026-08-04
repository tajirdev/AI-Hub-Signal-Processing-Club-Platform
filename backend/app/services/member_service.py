from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.member import Member
from app.schemas.member import MemberCreate, MemberUpdatePUT, MemberUpdatePATCH

class MemberService:

    @staticmethod
    def create_member(db: Session, sub_group_id: str, member_in: MemberCreate) -> Member:
        # Check email 
        existing = db.query(Member).filter(Member.email == member_in.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Member with this email already exists."
            )
        
        try:
            db_member = Member(
                sub_group_id=sub_group_id,
                full_name=member_in.full_name,
                email=member_in.email,
                phone_number=member_in.phone_number,
                role=member_in.role
            )
            db.add(db_member)
            db.commit()          # store in DB
            db.refresh(db_member) # take id created by DB
            return db_member
        except Exception as e:
            db.rollback()        # for any problem turn back transaction
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database insertion failed: {str(e)}"
            )

    @staticmethod
    def get_all_members(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Member).offset(skip).limit(limit).all()

    @staticmethod
    def get_first_member_or_me(db: Session) -> Member:
        member = db.query(Member).first()
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No member profile found."
            )
        return member

    @staticmethod
    def get_member_by_id(db: Session, member_id: int) -> Member:
        member = db.query(Member).filter(Member.id == member_id).first()
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Member with ID '{member_id}' not found."
            )
        return member

    @staticmethod
    def update_member_put(db: Session, member_id: int, update_data: MemberUpdatePUT) -> Member:
        member = MemberService.get_member_by_id(db, member_id)
        for key, value in update_data.model_dump().items():
            setattr(member, key, value)
        db.commit()
        db.refresh(member)
        return member

    @staticmethod
    def update_member_patch(db: Session, member_id: int, update_data: MemberUpdatePATCH) -> Member:
        member = MemberService.get_member_by_id(db, member_id)
        patch_dict = update_data.model_dump(exclude_unset=True)
        for key, value in patch_dict.items():
            setattr(member, key, value)
        db.commit()
        db.refresh(member)
        return member

    @staticmethod
    def delete_member(db: Session, member_id: int):
        member = MemberService.get_member_by_id(db, member_id)
        db.delete(member)
        db.commit()
        return None