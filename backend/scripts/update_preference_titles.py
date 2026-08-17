"""
Script para atualizar os títulos e answer_type das preferências no banco de dados.
Execute com: python -m scripts.update_preference_titles
Ou via Docker: docker compose exec app python -m scripts.update_preference_titles
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import update
from app.models.preferences_model import Preferences
from app.enums import AnswerType, DefaultPreference
from infra.database.config import SessionLocal


def update_preferences():
    """Atualiza títulos e answer_type das preferências baseado no enum DefaultPreference."""
    session = SessionLocal()
    try:
        updated_count = 0
        
        # Busca todas as preferências do banco
        all_prefs = session.query(Preferences).all()
        
        # Cria mapeamento de títulos antigos para novos valores do enum
        # Isso permite atualizar preferências mesmo com títulos diferentes
        for pref in all_prefs:
            # Tenta encontrar a preferência correspondente no enum pelo nome similar
            for default_pref in DefaultPreference:
                # Compara se o título atual começa com parte do título esperado
                if _titles_match(pref.title, default_pref):
                    pref.title = default_pref.title
                    pref.answer_type = default_pref.answer_type
                    updated_count += 1
                    print(f"✓ Atualizado: {default_pref.name} -> {default_pref.title} ({default_pref.answer_type.value})")
                    break

        session.commit()
        print(f"\nTotal de {updated_count} preferências atualizadas.")
    except Exception as e:
        session.rollback()
        print(f"Erro: {e}")
        raise
    finally:
        session.close()


def _titles_match(db_title: str, default_pref: DefaultPreference) -> bool:
    """Verifica se o título do banco corresponde a uma preferência do enum."""
    if not db_title:
        return False
    
    # Lista de palavras-chave para cada preferência
    keywords = {
        "SMOKER": ["fumante", "fuma"],
        "HAS_PETS": ["pets", "pet", "animais"],
        "WORKS_FROM_HOME": ["home office", "trabalha em casa"],
        "STUDENT": ["estudante"],
        "EARLY_RISER": ["acorda cedo", "cedo"],
        "NIGHT_OWL": ["dorme tarde", "tarde"],
        "LIKES_PARTIES": ["festas", "festa"],
        "PLAYS_MUSIC": ["instrumento", "música", "toca"],
        "COOKS_OFTEN": ["cozinha"],
        "CLEAN_FREAK": ["organizado", "limpeza"],
        "HAS_CAR": ["carro"],
        "ACCEPTS_SMOKER": ["aceita fumante"],
        "ACCEPTS_PETS": ["aceita pets"],
        "ACCEPTS_COUPLES": ["casais"],
        "QUIET_ENVIRONMENT": ["silencioso"],
        "ALLOWS_VISITORS": ["visitas"],
        "ALLOWS_PARTIES": ["permite festas"],
        "SHARED_EXPENSES": ["despesas"],
        "HOME_OFFICE_FRIENDLY": ["estrutura para home office"],
        "ACCEPTS_STUDENTS": ["aceita estudantes"],
        "HAS_PARKING": ["estacionamento"],
        "WOMEN_ONLY": ["apenas mulheres"],
        "MEN_ONLY": ["apenas homens"],
    }
    
    pref_keywords = keywords.get(default_pref.name, [])
    db_title_lower = db_title.lower()
    
    return any(kw in db_title_lower for kw in pref_keywords)


if __name__ == "__main__":
    update_preferences()
