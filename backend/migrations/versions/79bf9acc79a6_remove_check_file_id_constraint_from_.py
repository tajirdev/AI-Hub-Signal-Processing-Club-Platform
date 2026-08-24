"""remove_check_file_id_constraint_from_resources

Revision ID: 79bf9acc79a6
Revises: faffdc0a4739
Create Date: 2026-08-23 20:15:20.965873

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '79bf9acc79a6'
down_revision: Union[str, Sequence[str], None] = 'faffdc0a4739'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_constraint('check_file_id_or_external_url', 'resources', type_='check')


def downgrade() -> None:
    """Downgrade schema."""
    op.create_check_constraint('check_file_id_or_external_url', 'resources', 'file_id IS NOT NULL OR external_url IS NOT NULL')
