from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.research import Research
from app.models.ModoleUsers import Users
from app.schemas.research import ResearchCreate, ResearchResponse, ResearchUpdate, ResearchPaginatedResponse
from app.services import research_service
from app.core.RoleAuth import RoleChecker

router = APIRouter(prefix="/research", tags=["RESEARCH"])

# Access control rules
member_required = RoleChecker(["member", "editor", "super_admin"])
editor_required = RoleChecker(["editor", "super_admin"])


class ResearchFormatter:
    """Formatter class responsible for transforming database entities into API response schemas."""

    @classmethod
    def format_single(cls, entry: Research) -> ResearchResponse:
        """Transform a single Research database model instance into a ResearchResponse schema."""
        authors = [
            {
                "id": ra.member.id,
                "user_id": ra.member.user_id,
                "position": ra.member.position,
                "author_order": ra.author_order
            }
            for ra in entry.authors
        ]

        return ResearchResponse(
            id=entry.id,
            title=entry.title,
            slug=entry.slug,
            abstract=entry.abstract,
            content=entry.content,
            publication_date=entry.publication_date,
            pdf_url=entry.pdf_url,
            created_by=entry.created_by,
            featured=entry.featured,
            created_at=entry.created_at,
            updated_at=entry.updated_at,
            authors=authors
        )

    @classmethod
    def format_paginated(cls, entries: List[Research], total: int, page: int, limit: int) -> ResearchPaginatedResponse:
        """Format a collection of Research models into a paginated response wrapper."""
        pages = (total + limit - 1) // limit if total > 0 else 0
        formatted_entries = [cls.format_single(e) for e in entries]

        return ResearchPaginatedResponse(
            total=total,
            page=page,
            limit=limit,
            pages=pages,
            data=formatted_entries
        )


class ResearchQueryParameters:
    """Dependency injection class to parse, validate, and hold query parameters for fetching research entries."""

    def __init__(
        self,
        page: int = Query(1, ge=1),
        limit: int = Query(10, ge=1, le=100),
        search: Optional[str] = Query(None),
        sort: str = Query("publication_date", pattern="^(publication_date|title)$"),
        order: str = Query("desc", pattern="^(asc|desc)$"),
        featured: Optional[bool] = Query(None),
    ):
        self.page = page
        self.limit = limit
        self.search = search
        self.sort = sort
        self.order = order
        self.featured = featured


class ResearchController:
    """Controller class encapsulating route handlers for Research API operations."""

    @staticmethod
    @router.post("", response_model=ResearchResponse, status_code=status.HTTP_201_CREATED)
    def create_research(
        request: ResearchCreate,
        current_user: Users = Depends(editor_required),
        db: Session = Depends(get_db)
    ):
        """Create a new research entry; available to Editors and Super Admins."""
        entry = research_service.create(request, current_user, db)
        return ResearchFormatter.format_single(entry)

    @staticmethod
    @router.get("", response_model=ResearchPaginatedResponse)
    def get_all_research(
        params: ResearchQueryParameters = Depends(),
        current_user: Users = Depends(member_required),
        db: Session = Depends(get_db)
    ):
        """Get research entries based on caller role visibility, pagination, and filters."""
        entries, total = research_service.get_all(
            current_user,
            params.page,
            params.limit,
            params.search,
            params.sort,
            params.order,
            params.featured,
            db
        )
        return ResearchFormatter.format_paginated(entries, total, params.page, params.limit)

    @staticmethod
    @router.get("/{research_id}", response_model=ResearchResponse)
    def get_research(
        research_id: int,
        current_user: Users = Depends(member_required),
        db: Session = Depends(get_db)
    ):
        """Retrieve details for a single research entry."""
        entry = research_service.get_by_id(research_id, current_user, db)
        return ResearchFormatter.format_single(entry)

    @staticmethod
    @router.put("/{research_id}", response_model=ResearchResponse)
    def update_research(
        research_id: int,
        request: ResearchUpdate,
        current_user: Users = Depends(editor_required),
        db: Session = Depends(get_db)
    ):
        """Update a research entry; creator or Super Admin only."""
        entry = research_service.update(research_id, request, current_user, db)
        return ResearchFormatter.format_single(entry)

    @staticmethod
    @router.delete("/{research_id}", status_code=status.HTTP_204_NO_CONTENT)
    def delete_research(
        research_id: int,
        current_user: Users = Depends(editor_required),
        db: Session = Depends(get_db)
    ):
        """Delete a research entry; creator or Super Admin only."""
        research_service.delete(research_id, current_user, db)
        return None