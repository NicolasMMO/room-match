from typing import Dict, List, Optional

from app.enums import PreferenceResponse, PreferenceType
from app.models.preferences_model import Preferences
from app.models.vacancy_preferences_model import VacancyPreferences
from infra.database.base_repository import BaseRepository
from sqlalchemy import and_
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import delete, insert, select, update


class VacancyPreferencesRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(session)

    def create_vacancy_preference(
        self, vacancy_id: int, preference_id: int, rate: PreferenceResponse
    ) -> VacancyPreferences:
        stmt = (
            insert(VacancyPreferences)
            .values(vacancy_id=vacancy_id, preference_id=preference_id, rate=rate)
            .returning(VacancyPreferences)
        )
        result = self.execute_stmt(stmt)
        vacancy_preference = result.scalar_one()
        self.session.flush()
        return vacancy_preference

    def get_vacancy_preference(
        self, vacancy_id: int, preference_id: int
    ) -> Optional[VacancyPreferences]:
        stmt = select(VacancyPreferences).where(
            and_(
                VacancyPreferences.vacancy_id == vacancy_id,
                VacancyPreferences.preference_id == preference_id,
            )
        )
        result = self.session.execute(stmt)
        return result.scalar_one_or_none()

    def get_vacancy_preferences(self, vacancy_id: int) -> List[VacancyPreferences]:
        stmt = select(VacancyPreferences).where(
            VacancyPreferences.vacancy_id == vacancy_id
        )
        result = self.session.execute(stmt)
        return result.scalars().all()

    def get_vacancy_preferences_with_details(self, vacancy_id: int) -> List[Dict]:
        """
        Retorna as preferências da vaga com detalhes (título, tipo).
        Usado pelo ScoreCalculatorService.
        """
        stmt = (
            select(
                VacancyPreferences.rate,
                Preferences.id.label("preference_id"),
                Preferences.title,
                Preferences.preference_type,
            )
            .join(Preferences, VacancyPreferences.preference_id == Preferences.id)
            .where(VacancyPreferences.vacancy_id == vacancy_id)
        )

        result = self.session.execute(stmt)
        preferences = []
        for row in result:
            preferences.append(
                {
                    "preference_id": row.preference_id,
                    "title": row.title,
                    "preference_type": row.preference_type,
                    "rate": row.rate,
                }
            )
        return preferences

    def get_vacancy_preferences_by_type(
        self, vacancy_id: int, preference_type: PreferenceType
    ) -> List[Dict]:
        stmt = (
            select(
                VacancyPreferences.rate,
                Preferences.id.label("preference_id"),
                Preferences.title,
                Preferences.preference_type,
            )
            .join(Preferences, VacancyPreferences.preference_id == Preferences.id)
            .where(
                and_(
                    VacancyPreferences.vacancy_id == vacancy_id,
                    Preferences.preference_type == preference_type,
                )
            )
        )

        result = self.session.execute(stmt)
        preferences = []
        for row in result:
            preferences.append(
                {
                    "preference_id": row.preference_id,
                    "title": row.title,
                    "preference_type": row.preference_type,
                    "rate": row.rate,
                }
            )
        return preferences

    def update_vacancy_preference(
        self, vacancy_id: int, preference_id: int, rate: PreferenceResponse
    ) -> Optional[VacancyPreferences]:
        stmt = (
            update(VacancyPreferences)
            .where(
                and_(
                    VacancyPreferences.vacancy_id == vacancy_id,
                    VacancyPreferences.preference_id == preference_id,
                )
            )
            .values(rate=rate)
            .returning(VacancyPreferences)
        )

        result = self.execute_stmt(stmt)
        vacancy_preference = result.scalar_one_or_none()
        if vacancy_preference:
            self.session.flush()
        return vacancy_preference

    def upsert_vacancy_preference(
        self, vacancy_id: int, preference_id: int, rate: PreferenceResponse
    ) -> VacancyPreferences:
        existing = self.get_vacancy_preference(vacancy_id, preference_id)

        if existing:
            return self.update_vacancy_preference(vacancy_id, preference_id, rate)
        else:
            return self.create_vacancy_preference(vacancy_id, preference_id, rate)

    def delete_vacancy_preference(self, vacancy_id: int, preference_id: int) -> bool:
        stmt = delete(VacancyPreferences).where(
            and_(
                VacancyPreferences.vacancy_id == vacancy_id,
                VacancyPreferences.preference_id == preference_id,
            )
        )
        result = self.session.execute(stmt)
        self.session.commit()
        return result.rowcount > 0

    def delete_all_vacancy_preferences(self, vacancy_id: int) -> bool:
        stmt = delete(VacancyPreferences).where(
            VacancyPreferences.vacancy_id == vacancy_id
        )
        result = self.session.execute(stmt)
        self.session.commit()
        return result.rowcount > 0
