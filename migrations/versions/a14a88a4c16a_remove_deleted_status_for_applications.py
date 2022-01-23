"""Remove Deleted status for Applications

Revision ID: a14a88a4c16a
Revises: f7c61cd99317
Create Date: 2022-01-23 14:58:06.464677

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'a14a88a4c16a'
down_revision = 'f7c61cd99317'
branch_labels = None
depends_on = None

old_type = postgresql.ENUM('Active', 'Deleted', 'Restricted', name='externalapplicationstatus')
new_type = postgresql.ENUM('Active', 'Restricted', name='externalapplicationstatus')
tmp_type = postgresql.ENUM('Active', 'Deleted', 'Restricted', name='tmptype')


def upgrade():
    tmp_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE external_applications ALTER COLUMN status TYPE tmptype USING status::text::tmptype')
    old_type.drop(op.get_bind(), checkfirst=False)
    new_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE external_applications ALTER COLUMN status TYPE externalapplicationstatus USING status::text::externalapplicationstatus')


def downgrade():
    tmp_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE external_applications ALTER COLUMN status TYPE tmp_type USING status::text::tmp_type')
    new_type.drop(op.get_bind(), checkfirst=False)
    old_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE external_applications ALTER COLUMN status TYPE externalapplicationstatus USING status::text::externalapplicationstatus')
