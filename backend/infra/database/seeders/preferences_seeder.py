import logging
from typing import List

from app.enums import DefaultPreference
from app.models.preferences_model import Preferences
from sqlalchemy.orm import Session
from sqlalchemy import select

logger = logging.getLogger(__name__)


class PreferencesSeeder:
    """
    Seeder responsável por popular as preferências padrão do sistema.
    Executado automaticamente ao iniciar a aplicação.
    """

    def __init__(self, session: Session):
        self.session = session

    def seed(self) -> List[Preferences]:
        """
        Popula as preferências padrão no banco de dados.
        Insere novas preferências e atualiza existentes com title e answer_type corretos.

        Returns:
            Lista de preferências criadas ou atualizadas
        """
        created_preferences = []
        updated_preferences = []
        existing_prefs = self._get_existing_preferences()

        for default_pref in DefaultPreference:
            existing = existing_prefs.get(default_pref.title)
            
            if existing:
                # Atualiza preferência existente se answer_type mudou
                # Compara valores do enum para garantir compatibilidade
                current_answer_type = existing.answer_type.value if hasattr(existing.answer_type, 'value') else str(existing.answer_type)
                expected_answer_type = default_pref.answer_type.value
                
                if current_answer_type != expected_answer_type:
                    existing.answer_type = default_pref.answer_type
                    updated_preferences.append(existing)
                    logger.info(f"Preferência atualizada: {default_pref.title} -> {default_pref.answer_type.value}")
            else:
                # Cria nova preferência
                preference = self._create_preference(default_pref)
                created_preferences.append(preference)
                logger.info(f"Preferência criada: {default_pref.title}")

        if created_preferences or updated_preferences:
            self.session.commit()
            logger.info(f"Total de {len(created_preferences)} preferências criadas, {len(updated_preferences)} atualizadas")
        else:
            logger.info("Nenhuma nova preferência para criar ou atualizar")

        return created_preferences + updated_preferences

    def _get_existing_preferences(self) -> dict:
        """Retorna as preferências já existentes no banco mapeadas por título."""
        stmt = select(Preferences)
        result = self.session.execute(stmt)
        return {pref.title: pref for pref in result.scalars().all()}

    def _get_existing_titles(self) -> set:
        """Retorna os títulos das preferências já existentes no banco."""
        stmt = select(Preferences.title)
        result = self.session.execute(stmt)
        return {row[0] for row in result}

    def _create_preference(self, default_pref: DefaultPreference) -> Preferences:
        """Cria uma nova preferência no banco."""
        preference = Preferences(
            title=default_pref.title,
            preference_type=default_pref.preference_type,
            answer_type=default_pref.answer_type,
        )
        self.session.add(preference)
        self.session.flush()
        return preference

    def get_all_default_preferences(self) -> List[dict]:
        """Retorna a lista de preferências padrão definidas no enum."""
        return [
            {
                "name": pref.name,
                "title": pref.title,
                "type": pref.preference_type.value,
                "answer_type": pref.answer_type.value,
            }
            for pref in DefaultPreference
        ]


def run_preferences_seeder(session: Session) -> List[Preferences]:
    """
    Função auxiliar para executar o seeder de preferências.

    Args:
        session: Sessão do banco de dados

    Returns:
        Lista de preferências criadas
    """
    seeder = PreferencesSeeder(session)
    return seeder.seed()
