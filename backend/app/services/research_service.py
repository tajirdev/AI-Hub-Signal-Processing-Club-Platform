import re
from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Optional, Tuple, Type
from sqlalchemy import or_, asc, desc
from sqlalchemy.orm import Session, Query as SQLQuery
from fastapi import HTTPException, status
from app.models.research import Research, ResearchAuthor
from app.models.ModoleMembers import Members as Member
from app.schemas.research import ResearchCreate, ResearchUpdate

class AccessPolicy(ABC):
    """Abstract Base Strategy for applying role-based access rules."""
    
    @abstractmethod
    def apply_visibility_filter(self, query: SQLQuery, user_id: int) -> SQLQuery:
        """Filter list queries according to role permissions."""
        pass

    @abstractmethod
    def can_view_entry(self, entry: Research, user_id: int) -> bool:
        """Check if role can view a specific entry."""
        pass

    @abstractmethod
    def can_modify_entry(self, entry: Research, user_id: int) -> bool:
        """Check if role can update or delete an entry."""
        pass

    @abstractmethod
    def can_feature_entry(self) -> bool:
        """Check if role can toggle the featured status."""
        pass


class SuperAdminPolicy(AccessPolicy):
    """Super Admin has unconditional access across all actions."""

    def apply_visibility_filter(self, query: SQLQuery, user_id: int) -> SQLQuery:
        return query

    def can_view_entry(self, entry: Research, user_id: int) -> bool:
        return True

    def can_modify_entry(self, entry: Research, user_id: int) -> bool:
        return True

    def can_feature_entry(self) -> bool:
        return True


class EditorPolicy(AccessPolicy):
    """Editor can manage own entries and view published or own drafts."""

    def apply_visibility_filter(self, query: SQLQuery, user_id: int) -> SQLQuery:
        now = datetime.utcnow()
        return query.filter(
            or_(
                Research.publication_date <= now,
                Research.created_by == user_id
            )
        )

    def can_view_entry(self, entry: Research, user_id: int) -> bool:
        is_published = entry.publication_date is not None and entry.publication_date <= datetime.utcnow()
        return is_published or entry.created_by == user_id

    def can_modify_entry(self, entry: Research, user_id: int) -> bool:
        return entry.created_by == user_id

    def can_feature_entry(self) -> bool:
        return False


class MemberPolicy(AccessPolicy):
    """Member has read-only access strictly to published entries."""

    def apply_visibility_filter(self, query: SQLQuery, user_id: int) -> SQLQuery:
        return query.filter(Research.publication_date <= datetime.utcnow())

    def can_view_entry(self, entry: Research, user_id: int) -> bool:
        return entry.publication_date is not None and entry.publication_date <= datetime.utcnow()

    def can_modify_entry(self, entry: Research, user_id: int) -> bool:
        return False

    def can_feature_entry(self) -> bool:
        return False


class PolicyFactory:
    """Factory creating policy strategies dynamically without conditional branching."""

    _POLICIES = {
        "super_admin": SuperAdminPolicy,
        "editor": EditorPolicy,
        "member": MemberPolicy
    }

    @classmethod
    def get_policy(cls, user) -> AccessPolicy:
        role_name = getattr(user.role, "name", str(user.role)).lower()
        policy_class = cls._POLICIES.get(role_name, MemberPolicy)
        return policy_class()

class SlugGenerator:
    """Encapsulates slug creation and collision resolution logic."""

    @classmethod
    def generate(cls, title: str, db: Session, exclude_id: Optional[int] = None) -> str:
        base_slug = re.sub(r"[-\s]+", "-", re.sub(r"[^\w\s-]", "", title.lower()).strip())
        slug = base_slug
        counter = 1

        while cls._exists(slug, db, exclude_id):
            slug = f"{base_slug}-{counter}"
            counter += 1

        return slug

    @staticmethod
    def _exists(slug: str, db: Session, exclude_id: Optional[int]) -> bool:
        query = db.query(Research).filter(Research.slug == slug)
        if exclude_id:
            query = query.filter(Research.id != exclude_id)
        return query.first() is not None


class AuthorValidator:
    """Encapsulates author verification logic."""

    @staticmethod
    def validate(author_ids: List[int], db: Session) -> None:
        if not author_ids:
            return
        count = db.query(Member).filter(Member.id.in_(author_ids)).count()
        if count != len(set(author_ids)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more provided author_ids do not exist."
            )
class ResearchService:
    def create(self, request: ResearchCreate, current_user, db: Session) -> Research:
        policy = PolicyFactory.get_policy(current_user)
        AuthorValidator.validate(request.author_ids, db)

        entry = Research(
            title=request.title,
            slug=SlugGenerator.generate(request.title, db),
            abstract=request.abstract,
            content=request.content,
            pdf_url=request.pdf_url,
            publication_date=request.publication_date,
            created_by=current_user.id,
            featured=request.featured if policy.can_feature_entry() else False
        )
        db.add(entry)
        db.flush()

        self._assign_authors(entry.id, request.author_ids, db)
        db.commit()
        db.refresh(entry)
        return entry

    def get_all(
        self,
        current_user,
        db: Session,
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None,
        sort: str = "publication_date",
        order: str = "desc",
        featured: Optional[bool] = None
    ) -> Tuple[List[Research], int]:
        policy = PolicyFactory.get_policy(current_user)
        query = policy.apply_visibility_filter(db.query(Research), current_user.id)

        # Dynamic Search Filter
        if search:
            pattern = f"%{search}%"
            query = query.filter(
                or_(
                    Research.title.ilike(pattern),
                    Research.abstract.ilike(pattern),
                    Research.content.ilike(pattern)
                )
            )

        # Featured Filter
        if featured is not None:
            query = query.filter(Research.featured == featured)

        # Sorting
        sort_column = getattr(Research, sort, Research.publication_date)
        sort_direction = desc if order.lower() == "desc" else asc
        query = query.order_by(sort_direction(sort_column))

        total = query.count()
        entries = query.offset((page - 1) * limit).limit(limit).all()
        return entries, total

    def get_by_id(self, research_id: int, current_user, db: Session) -> Research:
        entry = db.query(Research).filter(Research.id == research_id).first()
        if not entry:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research entry not found.")

        policy = PolicyFactory.get_policy(current_user)
        if not policy.can_view_entry(entry, current_user.id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research entry not found.")

        return entry

    def update(self, research_id: int, request: ResearchUpdate, current_user, db: Session) -> Research:
        entry = self.get_by_id(research_id, current_user, db)
        policy = PolicyFactory.get_policy(current_user)

        if not policy.can_modify_entry(entry, current_user.id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

        data = request.model_dump(exclude_unset=True)

        if "title" in data:
            entry.slug = SlugGenerator.generate(data["title"], db, exclude_id=entry.id)

        if "featured" in data:
            entry.featured = data["featured"] if policy.can_feature_entry() else entry.featured
            data.pop("featured")

        if "author_ids" in data:
            author_ids = data.pop("author_ids")
            if author_ids is not None:
                AuthorValidator.validate(author_ids, db)
                db.query(ResearchAuthor).filter(ResearchAuthor.research_id == entry.id).delete()
                self._assign_authors(entry.id, author_ids, db)

        for field, value in data.items():
            setattr(entry, field, value)

        db.commit()
        db.refresh(entry)
        return entry

    def delete(self, research_id: int, current_user, db: Session) -> None:
        entry = self.get_by_id(research_id, current_user, db)
        policy = PolicyFactory.get_policy(current_user)

        if not policy.can_modify_entry(entry, current_user.id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

        db.delete(entry)
        db.commit()

    @staticmethod
    def _assign_authors(research_id: int, author_ids: List[int], db: Session) -> None:
        for order, member_id in enumerate(author_ids or [], start=1):
            db.add(ResearchAuthor(research_id=research_id, member_id=member_id, author_order=order))


research_service = ResearchService()