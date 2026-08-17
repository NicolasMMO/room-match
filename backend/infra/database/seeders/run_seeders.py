import logging
from contextlib import contextmanager

from infra.database.config import SessionLocal
from infra.database.seeders.preferences_seeder import run_preferences_seeder

logger = logging.getLogger(__name__)


@contextmanager
def get_seeder_session():
    """Context manager para sessão do seeder."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def run_all_seeders():
    """
    Executa todos os seeders do sistema.
    Deve ser chamado ao iniciar a aplicação.
    """
    logger.info("Iniciando execução dos seeders...")

    with get_seeder_session() as session:
        try:
            # Seeder de preferências
            run_preferences_seeder(session)

            logger.info("Seeders executados com sucesso!")

        except Exception as e:
            logger.error(f"Erro ao executar seeders: {str(e)}")
            session.rollback()
            raise
