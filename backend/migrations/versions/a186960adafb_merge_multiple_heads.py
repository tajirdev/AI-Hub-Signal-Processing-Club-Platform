"""merge multiple heads

Revision ID: a186960adafb
Revises: 2600215c7209, 48802ce555ca
Create Date: 2026-08-05 14:16:14.015513

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a186960adafb'
down_revision: Union[str, Sequence[str], None] = ('2600215c7209', '48802ce555ca')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
