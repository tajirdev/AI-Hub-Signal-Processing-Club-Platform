from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.member import (
    MemberCreate, 
    MemberResponse, 
    MemberUpdatePUT, 
    MemberUpdatePATCH
)
from app.services.member_service import MemberService

router = APIRouter(prefix="/member", tags=["MEMBER"])


@router.post("/{sub_group_id}", response_model=MemberResponse, status_code=status.HTTP_201_CREATED)
def create_member(sub_group_id: str, member_in: MemberCreate, db: Session = Depends(get_db)):
    return MemberService.create_member(db=db, sub_group_id=sub_group_id, member_in=member_in)


@router.get("/", response_model=List[MemberResponse])
def get_all_members(skip: int = Query(0, ge=0), limit: int = Query(100, le=500), db: Session = Depends(get_db)):
    return MemberService.get_all_members(db=db, skip=skip, limit=limit)


@router.get("/me", response_model=MemberResponse)
def get_my_profile(db: Session = Depends(get_db)):
    return MemberService.get_first_member_or_me(db=db)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_profile(db: Session = Depends(get_db)):
    me = MemberService.get_first_member_or_me(db=db)
    return MemberService.delete_member(db=db, member_id=me.id)


@router.patch("/me", response_model=MemberResponse)
def update_my_profile_partial(update_data: MemberUpdatePATCH, db: Session = Depends(get_db)):
    me = MemberService.get_first_member_or_me(db=db)
    return MemberService.update_member_patch(db=db, member_id=me.id, update_data=update_data)


@router.get("/{member_id}", response_model=MemberResponse)
def get_member_by_id(member_id: str, db: Session = Depends(get_db)):
    return MemberService.get_member_by_id(db=db, member_id=member_id)


@router.put("/{member_id}", response_model=MemberResponse)
def update_member_by_id(member_id: str, update_data: MemberUpdatePUT, db: Session = Depends(get_db)):
    return MemberService.update_member_put(db=db, member_id=member_id, update_data=update_data)


@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_member_by_id(member_id: str, db: Session = Depends(get_db)):
    return MemberService.delete_member(db=db, member_id=member_id)