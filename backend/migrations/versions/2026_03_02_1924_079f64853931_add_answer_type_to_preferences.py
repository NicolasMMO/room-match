"""add_answer_type_to_preferences

Revision ID: 079f64853931
Revises: 48937b298873
Create Date: 2026-03-02 19:24:38.776228

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '079f64853931'
down_revision: Union[str, Sequence[str], None] = '48937b298873'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Criar o tipo enum primeiro
    answertype_enum = sa.Enum('BOOLEAN', 'TERNARY', name='answertype')
    answertype_enum.create(op.get_bind(), checkfirst=True)
    
    # Adicionar coluna com valor padrão TERNARY para registros existentes
    op.add_column('preferences', sa.Column('answer_type', answertype_enum, nullable=True))
    
    # Atualizar registros existentes para TERNARY
    op.execute("UPDATE preferences SET answer_type = 'TERNARY' WHERE answer_type IS NULL")
    
    # Tornar a coluna NOT NULL
    op.alter_column('preferences', 'answer_type', nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('preferences', 'answer_type')
    
    # Remover o tipo enum
    sa.Enum(name='answertype').drop(op.get_bind(), checkfirst=True)
