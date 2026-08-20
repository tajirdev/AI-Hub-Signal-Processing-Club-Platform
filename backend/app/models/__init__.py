from app.core.database import Base
from .modeltest import Test
from .ModelUserRoles import UserRole
from .ModoleRoles import Role
from .ModoleUsers import Users
from .SubGroupModel import SubGroup
from .ModoleMembers import Members
from .EventModel import Events
from .blog_post import BlogPost,BlogCategory
from .category import Category
from .media import Media
from .research import Research
from .resource import Resource
from .newsmodel import News

# This allows Alembic to see everything through Base.metadata
__all__ = ["Base","Test","Users","Role","UserRole","SubGroup","BlogPost","BlogCategory","Category","Members","Media","Research","Resource","News"]
__all__ = ["Base","Test","Users","Role","UserRole","SubGroup","BlogPost","BlogCategory","Category","Members","Media","Research","Resource","Events"]
