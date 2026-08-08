from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.research import ResearchCreate, ResearchUpdate, ResearchResponse
from app.services import research_service
from app.core.RoleAuth import RoleChecker  

router = APIRouter(prefix="/research", tags=["RESEARCHES"])

member_required = RoleChecker(["member", "editor", "super_admin"])
editor_required = RoleChecker(["editor", "super_admin"])


@router.post("", response_model=ResearchResponse, status_code=status.HTTP_201_CREATED)
def create_research(
    request: ResearchCreate,
    current_user=Depends(editor_required),
    db: Session = Depends(get_db)
):
    return research_service.create_research(request, current_user, db)


@router.get("", response_model=List[ResearchResponse])
def get_all_research(
    search: Optional[str] = Query(None, description="Search by title, abstract, or content"),
    featured: Optional[bool] = Query(None, description="Filter by featured state"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    sort: str = Query("publication_date", regex="^(publication_date|title)$"),
    order: str = Query("desc", regex="^(asc|desc)$"),
    current_user=Depends(member_required),
    db: Session = Depends(get_db)
):
    return research_service.get_all_research(
        current_user=current_user,
        db=db,
        search=search,
        featured=featured,
        page=page,
        limit=limit,
        sort=sort,
        order=order
    )


@router.get("/{research_id}", response_model=ResearchResponse)
def get_research(
    research_id: int,
    current_user=Depends(member_required),
    db: Session = Depends(get_db)
):
    return research_service.get_research_by_id(research_id, current_user, db)


@router.put("/{research_id}", response_model=ResearchResponse)
def update_research(
    research_id: int,
    request: ResearchUpdate,
    current_user=Depends(editor_required),
    db: Session = Depends(get_db)
):
    return research_service.update_research(research_id, request, current_user, db)


@router.delete("/{research_id}", status_code=status.HTTP_200_OK)
def delete_research(
    research_id: int,
    current_user=Depends(editor_required),
    db: Session = Depends(get_db)
):
    return research_service.delete_research(research_id, current_user, db)