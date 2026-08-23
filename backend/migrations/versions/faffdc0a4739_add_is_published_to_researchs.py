"""add_is_published_to_researchs

Revision ID: faffdc0a4739
Revises: c82edcfef114
Create Date: 2026-08-23 19:51:55.590056

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'faffdc0a4739'
down_revision: Union[str, Sequence[str], None] = 'c82edcfef114'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('researchs', sa.Column('is_published', sa.Boolean(), nullable=False, server_default=sa.text('false')))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('researchs', 'is_published')
