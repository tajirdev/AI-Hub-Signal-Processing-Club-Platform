import re
from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status

from app.models.research import Research, ResearchAuthor
from app.models.ModoleMembers import Members
from app.models.ModoleUsers import Users
from app.schemas.research import ResearchCreate, ResearchUpdate, ResearchResponse, AuthorResponse


class ResearchService:
    def __init__(self, db: Session):
        self.db = db

    # Safe extraction of role to fix AttributeError across different user models
    def _get_user_role(self, user: Users) -> str:
        role_obj = getattr(user, "role", None) or getattr(user, "role_name", None) or getattr(user, "role_id", "")
        if hasattr(role_obj, "name"):
            return str(role_obj.name).lower()
        return str(role_obj).lower()

    # Generate unique slug
    def _generate_slug(self, title: str, current_id: Optional[int] = None) -> str:
        base_slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
        slug = base_slug
        counter = 1

        query = self.db.query(Research).filter(Research.slug == slug)
        if current_id:
            query = query.filter(Research.id != current_id)

        while self.db.query(query.exists()).scalar():
            slug = f"{base_slug}-{counter}"
            counter += 1
            query = self.db.query(Research).filter(Research.slug == slug)
            if current_id:
                query = query.filter(Research.id != current_id)

        return slug

    # Validate author IDs against Members model
    def _validate_authors(self, author_ids: Optional[List[int]]):
        if not author_ids:
            return
        records = self.db.query(Members.id).filter(Members.id.in_(author_ids)).all()
        existing_ids = {r[0] for r in records}
        missing_ids = set(author_ids) - existing_ids
        
        if missing_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Members with IDs {list(missing_ids)} do not exist."
            )

    # Format response object
    def _to_response(self, research: Research) -> ResearchResponse:
        authors = [
            AuthorResponse(
                id=assoc.member_id,
                full_name=getattr(assoc.member, "full_name", None) or getattr(assoc.member, "name", None),
                author_order=assoc.author_order
            )
            for assoc in sorted(research.authors_assoc, key=lambda x: x.author_order)
        ]
        return ResearchResponse(
            id=research.id,
            title=research.title,
            slug=research.slug,
            abstract=research.abstract,
            content=research.content,
            publication_date=research.publication_date,
            pdf_url=research.pdf_url,
            created_by=research.created_by,
            featured=research.featured,
            created_at=research.created_at,
            updated_at=research.updated_at,
            authors=authors
        )

    # Create research entry
    def create(self, data: ResearchCreate, current_user: Users) -> ResearchResponse:
        self._validate_authors(data.author_ids)
        slug = self._generate_slug(data.title)

        user_role = self._get_user_role(current_user)
        is_super = (user_role == "super_admin")

        research = Research(
            title=data.title,
            slug=slug,
            abstract=data.abstract,
            content=data.content,
            publication_date=data.publication_date,
            pdf_url=data.pdf_url,
            created_by=current_user.id,
            featured=data.featured if is_super else False
        )
        self.db.add(research)
        self.db.flush()

        if data.author_ids:
            for order, member_id in enumerate(data.author_ids, start=1):
                self.db.add(ResearchAuthor(
                    research_id=research.id, 
                    member_id=member_id, 
                    author_order=order
                ))

        self.db.commit()
        self.db.refresh(research)
        return self._to_response(research)

    # Get all research entries with pagination and RBAC
    def get_all(
        self,
        current_user: Users,
        search: Optional[str] = None,
        featured: Optional[bool] = None,
        page: int = 1,
        limit: int = 10,
        sort: str = "publication_date",
        order: str = "desc"
    ) -> List[ResearchResponse]:
        query = self.db.query(Research)
        user_role = self._get_user_role(current_user)
        now = datetime.utcnow()

        if user_role == "member":
            query = query.filter(
                Research.publication_date.isnot(None),
                Research.publication_date <= now
            )
        elif user_role == "editor":
            query = query.filter(
                or_(
                    Research.created_by == current_user.id,
                    (Research.publication_date.isnot(None)) & (Research.publication_date <= now)
                )
            )

        if search:
            pattern = f"%{search}%"
            query = query.filter(
                or_(
                    Research.title.ilike(pattern),
                    Research.abstract.ilike(pattern),
                    Research.content.ilike(pattern)
                )
            )

        if featured is not None:
            query = query.filter(Research.featured == featured)

        sort_col = getattr(Research, sort, Research.publication_date)
        query = query.order_by(sort_col.asc() if order.lower() == "asc" else sort_col.desc())

        offset = (page - 1) * limit
        results = query.offset(offset).limit(limit).all()

        return [self._to_response(item) for item in results]

    # Get single research entry by ID
    def get_by_id(self, research_id: int, current_user: Users) -> ResearchResponse:
        research = self.db.query(Research).filter(Research.id == research_id).first()
        if not research:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research entry not found")

        user_role = self._get_user_role(current_user)
        is_published = bool(research.publication_date and research.publication_date <= datetime.utcnow())

        if user_role == "member" and not is_published:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research entry not found")

        if user_role == "editor" and not is_published and research.created_by != current_user.id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research entry not found")

        return self._to_response(research)

    # Update research entry
    def update(self, research_id: int, data: ResearchUpdate, current_user: Users) -> ResearchResponse:
        research = self.db.query(Research).filter(Research.id == research_id).first()
        if not research:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research entry not found")

        user_role = self._get_user_role(current_user)
        if research.created_by != current_user.id and user_role != "super_admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You do not have permission to edit this entry"
            )

        update_data = data.model_dump(exclude_unset=True)

        if "featured" in update_data and user_role != "super_admin":
            del update_data["featured"]

        if "title" in update_data:
            research.slug = self._generate_slug(update_data["title"], current_id=research.id)

        if "author_ids" in update_data:
            author_ids = update_data.pop("author_ids")
            self._validate_authors(author_ids)
            self.db.query(ResearchAuthor).filter(ResearchAuthor.research_id == research.id).delete()
            if author_ids:
                for order, member_id in enumerate(author_ids, start=1):
                    self.db.add(ResearchAuthor(
                        research_id=research.id, 
                        member_id=member_id, 
                        author_order=order
                    ))

        for key, value in update_data.items():
            setattr(research, key, value)

        research.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(research)
        return self._to_response(research)

    # Delete research entry
    def delete(self, research_id: int, current_user: Users):
        research = self.db.query(Research).filter(Research.id == research_id).first()
        if not research:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research entry not found")

        user_role = self._get_user_role(current_user)
        if research.created_by != current_user.id and user_role != "super_admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You do not have permission to delete this entry"
            )

        self.db.delete(research)
        self.db.commit()
        return {"message": "Research entry deleted successfully"}