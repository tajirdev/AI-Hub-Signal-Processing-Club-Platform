from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.research import ResearchCreate, ResearchUpdate, ResearchResponse
from app.services.research_service import ResearchService
from app.core.RoleAuth import RoleChecker

router = APIRouter(prefix="/research", tags=["RESEARCH"])

member_required = RoleChecker(["member", "editor", "super_admin"])
editor_required = RoleChecker(["editor", "super_admin"])


def get_research_service(db: Session = Depends(get_db)) -> ResearchService:
    return ResearchService(db)


@router.post("", response_model=ResearchResponse, status_code=status.HTTP_201_CREATED)
def create_research(
    request: ResearchCreate,
    current_user=Depends(editor_required),
    service: ResearchService = Depends(get_research_service)
):
    return service.create(request, current_user)


@router.get("", response_model=List[ResearchResponse])
def get_all_research(
    search: Optional[str] = Query(None, description="Search by title, abstract, or content"),
    featured: Optional[bool] = Query(None, description="Filter by featured state"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    sort: str = Query("publication_date", pattern="^(publication_date|title)$"),
    order: str = Query("desc", pattern="^(asc|desc)$"),
    current_user=Depends(member_required),
    service: ResearchService = Depends(get_research_service)
):
    return service.get_all(
        current_user=current_user,
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
    service: ResearchService = Depends(get_research_service)
):
    return service.get_by_id(research_id, current_user)


@router.put("/{research_id}", response_model=ResearchResponse)
def update_research(
    research_id: int,
    request: ResearchUpdate,
    current_user=Depends(editor_required),
    service: ResearchService = Depends(get_research_service)
):
    return service.update(research_id, request, current_user)


@router.delete("/{research_id}", status_code=status.HTTP_200_OK)
def delete_research(
    research_id: int,
    current_user=Depends(editor_required),
    service: ResearchService = Depends(get_research_service)
):
    return service.delete(research_id, current_user)