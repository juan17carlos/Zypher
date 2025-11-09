"""update deals table phase 3

Revision ID: ac789def1234
Revises: fb9a123bc456
Create Date: 2025-11-08 23:40:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'ac789def1234'
down_revision = 'fb9a123bc456'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Crear enum types si no existen
    deal_stage_enum = postgresql.ENUM(
        'LEAD', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST',
        name='dealstage',
        create_type=False
    )

    deal_priority_enum = postgresql.ENUM(
        'LOW', 'MEDIUM', 'HIGH', 'URGENT',
        name='dealpriority',
        create_type=False
    )

    deal_source_enum = postgresql.ENUM(
        'WEBSITE', 'REFERRAL', 'COLD_CALL', 'SOCIAL_MEDIA', 'EMAIL_CAMPAIGN', 'EVENT', 'PARTNER', 'OTHER',
        name='dealsource',
        create_type=False
    )

    # Crear tipos enum solo si no existen
    connection = op.get_bind()

    # Check and create dealpriority
    result = connection.execute(sa.text("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dealpriority')")).scalar()
    if not result:
        connection.execute(sa.text("CREATE TYPE dealpriority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT')"))

    # Check and create dealsource
    result = connection.execute(sa.text("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dealsource')")).scalar()
    if not result:
        connection.execute(sa.text("CREATE TYPE dealsource AS ENUM ('WEBSITE', 'REFERRAL', 'COLD_CALL', 'SOCIAL_MEDIA', 'EMAIL_CAMPAIGN', 'EVENT', 'PARTNER', 'OTHER')"))

    # Check and create dealstage
    result = connection.execute(sa.text("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dealstage')")).scalar()
    if not result:
        connection.execute(sa.text("CREATE TYPE dealstage AS ENUM ('LEAD', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST')"))

    # Crear tabla temporal
    op.create_table(
        'deals_new',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('title', sa.String(300), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('value', sa.Float, nullable=False, default=0.0),
        sa.Column('currency', sa.String(10), nullable=False, default='USD'),
        sa.Column('stage', deal_stage_enum, nullable=False, default='LEAD'),
        sa.Column('probability', sa.Integer, nullable=False, default=0),
        sa.Column('priority', deal_priority_enum, nullable=False, default='MEDIUM'),
        sa.Column('source', deal_source_enum, nullable=True),
        sa.Column('expected_close_date', sa.Date, nullable=True),
        sa.Column('actual_close_date', sa.Date, nullable=True),
        sa.Column('lost_reason', sa.String(500), nullable=True),
        sa.Column('tags', postgresql.JSON, nullable=True),
        sa.Column('custom_fields', postgresql.JSON, nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=False, default=True),
        sa.Column('contact_id', sa.Integer, sa.ForeignKey('contacts.id'), nullable=False),
        sa.Column('owner_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime, nullable=False, server_default=sa.text('now()'), onupdate=sa.text('now()')),
    )

    # Crear índices
    op.create_index('ix_deals_new_id', 'deals_new', ['id'])
    op.create_index('ix_deals_new_title', 'deals_new', ['title'])
    op.create_index('ix_deals_new_value', 'deals_new', ['value'])
    op.create_index('ix_deals_new_stage', 'deals_new', ['stage'])
    op.create_index('ix_deals_new_expected_close_date', 'deals_new', ['expected_close_date'])
    op.create_index('ix_deals_new_is_active', 'deals_new', ['is_active'])
    op.create_index('ix_deals_new_contact_id', 'deals_new', ['contact_id'])
    op.create_index('ix_deals_new_owner_id', 'deals_new', ['owner_id'])

    # Migrar datos si la tabla deals existe
    connection = op.get_bind()
    inspector = sa.inspect(connection)

    if 'deals' in inspector.get_table_names():
        # Copiar datos existentes
        # Solo copiamos si hay datos
        op.execute("""
            INSERT INTO deals_new (title, description, value, currency, stage, probability,
                                   expected_close_date, contact_id, owner_id, created_at, updated_at,
                                   priority, source, tags, custom_fields, is_active)
            SELECT title, description, value, currency, stage::text::dealstage, probability,
                   expected_close_date, contact_id, owner_id, created_at, updated_at,
                   'MEDIUM'::dealpriority, 'OTHER'::dealsource, '[]'::json, '{}'::json, true
            FROM deals
        """)

        # Eliminar tabla vieja (CASCADE para eliminar foreign keys dependientes)
        connection.execute(sa.text("DROP TABLE deals CASCADE"))

    # Renombrar tabla nueva
    op.rename_table('deals_new', 'deals')

    # Recrear foreign keys que fueron eliminadas con CASCADE
    connection.execute(sa.text("ALTER TABLE notes ADD CONSTRAINT notes_deal_id_fkey FOREIGN KEY (deal_id) REFERENCES deals(id)"))
    connection.execute(sa.text("ALTER TABLE tasks ADD CONSTRAINT tasks_deal_id_fkey FOREIGN KEY (deal_id) REFERENCES deals(id)"))


def downgrade() -> None:
    # Crear tabla vieja
    op.create_table(
        'deals_old',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('title', sa.String, nullable=False),
        sa.Column('description', sa.String, nullable=True),
        sa.Column('value', sa.Float, default=0.0, nullable=False),
        sa.Column('currency', sa.String, default='USD', nullable=False),
        sa.Column('stage', sa.String, default='lead', nullable=False),
        sa.Column('probability', sa.Integer, default=0, nullable=False),
        sa.Column('expected_close_date', sa.Date, nullable=True),
        sa.Column('custom_fields', sa.JSON, nullable=True),
        sa.Column('contact_id', sa.Integer, nullable=False),
        sa.Column('owner_id', sa.Integer, nullable=False),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Copiar datos de vuelta (se perderán los nuevos campos)
    op.execute("""
        INSERT INTO deals_old (title, description, value, currency, stage, probability,
                               expected_close_date, custom_fields, contact_id, owner_id, created_at, updated_at)
        SELECT title, description, value, currency, stage::text, probability,
               expected_close_date, custom_fields, contact_id, owner_id, created_at, updated_at
        FROM deals
    """)

    # Eliminar tabla nueva
    op.drop_table('deals')

    # Renombrar tabla vieja
    op.rename_table('deals_old', 'deals')

    # Eliminar enum types
    op.execute('DROP TYPE IF EXISTS dealpriority CASCADE')
    op.execute('DROP TYPE IF EXISTS dealsource CASCADE')
