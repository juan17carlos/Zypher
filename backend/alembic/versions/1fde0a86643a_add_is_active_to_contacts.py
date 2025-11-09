"""add_is_active_to_contacts

Revision ID: 1fde0a86643a
Revises: ac789def1234
Create Date: 2025-11-09 06:28:30.538384

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1fde0a86643a'
down_revision = 'ac789def1234'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Agregar columna is_active a contacts
    op.add_column('contacts', sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'))


def downgrade() -> None:
    # Eliminar columna is_active de contacts
    op.drop_column('contacts', 'is_active')
