"""Update Contact model with complete standards - Phase 2

Revision ID: fb9a123bc456
Revises: ea678867832c
Create Date: 2025-11-08 23:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'fb9a123bc456'
down_revision = 'ea678867832c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add new columns to contacts table
    op.add_column('contacts', sa.Column('mobile', sa.String(length=15), nullable=True))
    op.add_column('contacts', sa.Column('website', sa.String(length=200), nullable=True))

    # Change notes column type from String to Text
    op.alter_column('contacts', 'notes',
                    existing_type=sa.String(),
                    type_=sa.Text(),
                    existing_nullable=True)


def downgrade() -> None:
    # Revert notes column type from Text back to String
    op.alter_column('contacts', 'notes',
                    existing_type=sa.Text(),
                    type_=sa.String(),
                    existing_nullable=True)

    # Remove added columns
    op.drop_column('contacts', 'website')
    op.drop_column('contacts', 'mobile')
