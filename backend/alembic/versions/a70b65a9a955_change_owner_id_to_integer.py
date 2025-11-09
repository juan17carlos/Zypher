"""change_owner_id_to_integer

Revision ID: a70b65a9a955
Revises: 1fde0a86643a
Create Date: 2025-11-09 06:57:21.033668

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a70b65a9a955'
down_revision = '1fde0a86643a'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Cambiar owner_id de UUID a INTEGER en la tabla contacts
    op.alter_column('contacts', 'owner_id',
                    type_=sa.Integer(),
                    existing_type=sa.dialects.postgresql.UUID(as_uuid=True),
                    postgresql_using='owner_id::text::integer',
                    existing_nullable=False)


def downgrade() -> None:
    # Revertir owner_id de INTEGER a UUID
    op.alter_column('contacts', 'owner_id',
                    type_=sa.dialects.postgresql.UUID(as_uuid=True),
                    existing_type=sa.Integer(),
                    postgresql_using='owner_id::text::uuid',
                    existing_nullable=False)
