from typing import Dict, List, Optional

from app.enums import PreferenceResponse, PreferenceType
from app.models.vacancy_preferences_model import VacancyPreferences
from app.repositories.preferences_repository import PreferencesRepository
from app.repositories.vacancy_preferences_repository import VacancyPreferencesRepository


class VacancyPreferencesService:
    def __init__(
        self,
        vacancy_preferences_repository: VacancyPreferencesRepository,
        preferences_repository: PreferencesRepository,
    ):
        self.vacancy_preferences_repository = vacancy_preferences_repository
        self.preferences_repository = preferences_repository

    def set_vacancy_preference(
        self, vacancy_id: int, preference_id: int, rate: PreferenceResponse
    ) -> VacancyPreferences:
        preference = self.preferences_repository.get_preference_by_id(preference_id)
        if not preference:
            raise ValueError(f"Preferência com ID {preference_id} não encontrada")

        return self.vacancy_preferences_repository.upsert_vacancy_preference(
            vacancy_id, preference_id, rate
        )

    def get_vacancy_preferences(self, vacancy_id: int) -> List[Dict]:
        return self.vacancy_preferences_repository.get_vacancy_preferences_with_details(
            vacancy_id
        )

    def get_vacancy_preferences_by_type(
        self, vacancy_id: int, preference_type: PreferenceType
    ) -> List[Dict]:
        return self.vacancy_preferences_repository.get_vacancy_preferences_by_type(
            vacancy_id, preference_type
        )

    def get_vacancy_preference(
        self, vacancy_id: int, preference_id: int
    ) -> Optional[VacancyPreferences]:
        return self.vacancy_preferences_repository.get_vacancy_preference(
            vacancy_id, preference_id
        )

    def set_multiple_vacancy_preferences(
        self, vacancy_id: int, preferences: List[Dict]
    ) -> List[VacancyPreferences]:
        results = []
        for pref_data in preferences:
            preference_id = pref_data.get("preference_id")
            rate = pref_data.get("rate")

            if not preference_id or not rate:
                continue

            try:
                result = self.set_vacancy_preference(vacancy_id, preference_id, rate)
                results.append(result)
            except ValueError:
                continue

        return results

    def remove_vacancy_preference(self, vacancy_id: int, preference_id: int) -> bool:
        return self.vacancy_preferences_repository.delete_vacancy_preference(
            vacancy_id, preference_id
        )

    def remove_all_vacancy_preferences(self, vacancy_id: int) -> bool:
        return self.vacancy_preferences_repository.delete_all_vacancy_preferences(
            vacancy_id
        )
