"""widen_members_position_to_150

Revision ID: 5c8f9f150dc6
Revises: 3e68faf2fc6e
Create Date: 2026-08-23 20:35:42.991497

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5c8f9f150dc6'
down_revision: Union[str, Sequence[str], None] = '3e68faf2fc6e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('members', 'position',
                    existing_type=sa.VARCHAR(length=25),
                    type_=sa.VARCHAR(length=150),
                    existing_nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('members', 'position',
                    existing_type=sa.VARCHAR(length=150),
                    type_=sa.VARCHAR(length=25),
                    existing_nullable=True)
