"""add category_id to events

Revision ID: 9a1b2c3d4e5f
Revises: 83939dc5e424
Create Date: 2026-08-21 04:57:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9a1b2c3d4e5f'
down_revision: Union[str, Sequence[str], None] = '83939dc5e424'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('events', sa.Column('category_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'fk_events_category_id',
        'events', 'categories',
        ['category_id'], ['id'],
        ondelete='SET NULL'
    )


def downgrade() -> None:
    op.drop_constraint('fk_events_category_id', 'events', type_='foreignkey')
    op.drop_column('events', 'category_id')
