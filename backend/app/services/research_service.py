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


def _generate_slug(title: str, db: Session, current_id: Optional[int] = None) -> str:
    base_slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
    slug = base_slug
    counter = 1

    query = db.query(Research).filter(Research.slug == slug)
    if current_id:
        query = query.filter(Research.id != current_id)

    while db.query(query.exists()).scalar():
        slug = f"{base_slug}-{counter}"
        counter += 1
        query = db.query(Research).filter(Research.slug == slug)
        if current_id:
            query = query.filter(Research.id != current_id)

    return slug


def _validate_authors(author_ids: List[int], db: Session):
    if not author_ids:
        return
    existing_ids = db.query(Members.id).filter(Members.id.in_(author_ids)).all()
    existing_ids_set = {m[0] for m in existing_ids}
    missing_ids = set(author_ids) - existing_ids_set
    if missing_ids:
        raise HTTPException(
            status_code=status.HTTP,
            detail=f"Members with IDs {list(missing_ids)} do not exist."
        )


def _to_response(research: Research) -> ResearchResponse:
    authors = [
        AuthorResponse(
            id=assoc.member_id,
            full_name=getattr(assoc.member, "full_name", None),
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


def create_research(data: ResearchCreate, current_user: Users, db: Session) -> ResearchResponse:
    _validate_authors(data.author_ids, db)

    slug = _generate_slug(data.title, db)
    user_role = getattr(current_user.role, "name", str(current_user.role)).lower()
    featured = data.featured if user_role == "super_admin" else False

    research = Research(
        title=data.title,
        slug=slug,
        abstract=data.abstract,
        content=data.content,
        publication_date=data.publication_date,
        pdf_url=data.pdf_url,
        created_by=current_user.id,
        featured=featured
    )
    db.add(research)
    db.flush()

    if data.author_ids:
        for order, member_id in enumerate(data.author_ids, start=1):
            db.add(ResearchAuthor(research_id=research.id, member_id=member_id, author_order=order))

    db.commit()
    db.refresh(research)
    return _to_response(research)


def get_all_research(
    current_user: Users,
    db: Session,
    search: Optional[str] = None,
    featured: Optional[bool] = None,
    page: int = 1,
    limit: int = 10,
    sort: str = "publication_date",
    order: str = "desc"
) -> List[ResearchResponse]:
    query = db.query(Research)
    user_role = getattr(current_user.role, "name", str(current_user.role)).lower()

    # RBAC Visibility Rules
    if user_role == "member":
        query = query.filter(
            Research.publication_date.isnot(None),
            Research.publication_date <= datetime.utcnow()
        )
    elif user_role == "editor":
        query = query.filter(
            or_(
                Research.created_by == current_user.id,
                (Research.publication_date.isnot(None)) & (Research.publication_date <= datetime.utcnow())
            )
        )
    # super_admin sees all

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Research.title.ilike(search_pattern),
                Research.abstract.ilike(search_pattern),
                Research.content.ilike(search_pattern)
            )
        )

    if featured is not None:
        query = query.filter(Research.featured == featured)

    # Sorting
    sort_column = getattr(Research, sort, Research.publication_date)
    query = query.order_by(sort_column.asc() if order.lower() == "asc" else sort_column.desc())

    # Pagination
    offset = (page - 1) * limit
    results = query.offset(offset).limit(limit).all()

    return [_to_response(r) for r in results]


def get_research_by_id(research_id: int, current_user: Users, db: Session) -> ResearchResponse:
    research = db.query(Research).filter(Research.id == research_id).first()
    if not research:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research entry not found")

    user_role = getattr(current_user.role, "name", str(current_user.role)).lower()

    # Visibility Gate
    is_published = research.publication_date and research.publication_date <= datetime.utcnow()
    if user_role == "member" and not is_published:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research entry not found")

    if user_role == "editor" and not is_published and research.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research entry not found")

    return _to_response(research)


def update_research(research_id: int, data: ResearchUpdate, current_user: Users, db: Session) -> ResearchResponse:
    research = db.query(Research).filter(Research.id == research_id).first()
    if not research:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research entry not found")

    user_role = getattr(current_user.role, "name", str(current_user.role)).lower()

    # Authorization check
    if research.created_by != current_user.id and user_role != "super_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to edit this entry")

    update_data = data.model_dump(exclude_unset=True)

    # Strip featured if non-super_admin
    if "featured" in update_data and user_role != "super_admin":
        del update_data["featured"]

    if "title" in update_data:
        research.slug = _generate_slug(update_data["title"], db, current_id=research.id)

    if "author_ids" in update_data:
        author_ids = update_data.pop("author_ids")
        _validate_authors(author_ids, db)
        db.query(ResearchAuthor).filter(ResearchAuthor.research_id == research.id).delete()
        if author_ids:
            for order, member_id in enumerate(author_ids, start=1):
                db.add(ResearchAuthor(research_id=research.id, member_id=member_id, author_order=order))

    for key, value in update_data.items():
        setattr(research, key, value)

    research.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(research)
    return _to_response(research)


def delete_research(research_id: int, current_user: Users, db: Session):
    research = db.query(Research).filter(Research.id == research_id).first()
    if not research:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research entry not found")

    user_role = getattr(current_user.role, "name", str(current_user.role)).lower()

    if research.created_by != current_user.id and user_role != "super_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this entry")

    db.delete(research)
    db.commit()
    return {"message": "Research entry deleted successfully"}