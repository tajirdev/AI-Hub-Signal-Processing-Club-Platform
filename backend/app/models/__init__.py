from app.core.database import Base
from .modeltest import Test
from .ModelUserRoles import UserRole
from .ModoleRoles import Role
from .ModoleUsers import Users
from .SubGroupModel import SubGroup
from .ModoleMembers import Members
from .EventModel import Events

# This allows Alembic to see everything through Base.metadata
__all__ = ["Base","Test","Users","Role","UserRole","SubGroup","Members","Events"]
