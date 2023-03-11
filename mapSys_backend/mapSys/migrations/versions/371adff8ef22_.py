"""empty message

Revision ID: 371adff8ef22
Revises: d6618a280e7e
Create Date: 2023-03-10 23:08:11.351222

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '371adff8ef22'
down_revision = 'd6618a280e7e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('gisdocs', schema=None) as batch_op:
        batch_op.alter_column('dateTime',
               existing_type=postgresql.TIMESTAMP(),
               type_=sa.String(),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('gisdocs', schema=None) as batch_op:
        batch_op.alter_column('dateTime',
               existing_type=sa.String(),
               type_=postgresql.TIMESTAMP(),
               existing_nullable=True)

    # ### end Alembic commands ###
