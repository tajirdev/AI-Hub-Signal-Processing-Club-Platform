"""widen_otps_otp_code_to_255

Revision ID: dec33d0996d4
Revises: 5c8f9f150dc6
Create Date: 2026-08-23 21:13:35.260976

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dec33d0996d4'
down_revision: Union[str, Sequence[str], None] = '5c8f9f150dc6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('otps', 'otp_code',
                    existing_type=sa.VARCHAR(length=10),
                    type_=sa.VARCHAR(length=255),
                    existing_nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('otps', 'otp_code',
                    existing_type=sa.VARCHAR(length=255),
                    type_=sa.VARCHAR(length=10),
                    existing_nullable=False)
