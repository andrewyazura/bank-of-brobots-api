"""update permissions type

Revision ID: 1456a620f0e4
Revises: 2e0ace032da5
Create Date: 2022-03-04 14:28:26.679118

"""
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "1456a620f0e4"
down_revision = "2e0ace032da5"
branch_labels = None
depends_on = None

# I HATE NATIVE POSTGRESQL ENUMS

old_type = postgresql.ENUM("Transactions", "UserToUserTransactions", name="permissions")
new_type = postgresql.ENUM(
    "Transactions",
    "UpdateTransactionStatus",
    "UserToUserTransactions",
    "Users",
    name="permissions",
)
tmp_type = postgresql.ENUM("Transactions", "UserToUserTransactions", name="tmptype")


def upgrade():
    tmp_type.create(op.get_bind(), checkfirst=False)
    op.execute(
        "ALTER TABLE external_applications ALTER COLUMN permissions TYPE"
        " tmptype[] USING permissions::text::tmptype[]"
    )
    old_type.drop(op.get_bind(), checkfirst=False)
    new_type.create(op.get_bind(), checkfirst=False)
    op.execute(
        "ALTER TABLE external_applications ALTER COLUMN permissions TYPE"
        " permissions[] USING permissions::text::permissions[]"
    )
    tmp_type.drop(op.get_bind(), checkfirst=False)


def downgrade():
    tmp_type.create(op.get_bind(), checkfirst=False)
    op.execute(
        "ALTER TABLE external_applications ALTER COLUMN permissions TYPE"
        " tmptype[] USING permissions::text::tmptype[]"
    )
    new_type.drop(op.get_bind(), checkfirst=False)
    old_type.create(op.get_bind(), checkfirst=False)
    op.execute(
        "ALTER TABLE external_applications ALTER COLUMN permissions TYPE"
        " permissions[] USING permissions::text::permissions[]"
    )
    tmp_type.drop(op.get_bind(), checkfirst=False)
