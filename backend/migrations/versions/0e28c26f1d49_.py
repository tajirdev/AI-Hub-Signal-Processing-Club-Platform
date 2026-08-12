"""empty message

Revision ID: 0e28c26f1d49
Revises: 5e2cfffde8ba, 64ec8613ada1, cf2d1db1e8b9
Create Date: 2026-08-10 10:21:27.409651

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0e28c26f1d49'
down_revision: Union[str, Sequence[str], None] = ('5e2cfffde8ba', '64ec8613ada1', 'cf2d1db1e8b9')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
