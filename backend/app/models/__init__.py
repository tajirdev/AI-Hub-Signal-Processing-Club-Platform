from app.core.database import Base
from .modeltest import Test

# This allows Alembic to see everything through Base.metadata
__all__ = ["Base","Test"]