"""widen_subgroups_name_to_150

Revision ID: 3e68faf2fc6e
Revises: 79bf9acc79a6
Create Date: 2026-08-23 20:31:09.921019

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3e68faf2fc6e'
down_revision: Union[str, Sequence[str], None] = '79bf9acc79a6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('sub_groups', 'name',
                    existing_type=sa.VARCHAR(length=25),
                    type_=sa.VARCHAR(length=150),
                    existing_nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('sub_groups', 'name',
                    existing_type=sa.VARCHAR(length=150),
                    type_=sa.VARCHAR(length=25),
                    existing_nullable=False)
