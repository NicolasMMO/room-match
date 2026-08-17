from typing import List, Optional

from app.enums import PreferenceType
from app.models.preferences_model import Preferences
from app.repositories.preferences_repository import PreferencesRepository


class PreferencesService:
    def __init__(self, preferences_repository: PreferencesRepository):
        self.preferences_repository = preferences_repository

    def create_preference(
        self, title: str, preference_type: PreferenceType
    ) -> Preferences:
        return self.preferences_repository.create_preference(title, preference_type)

    def get_preference_by_id(self, preference_id: int) -> Optional[Preferences]:
        return self.preferences_repository.get_preference_by_id(preference_id)

    def get_all_preferences(self) -> List[Preferences]:
        return self.preferences_repository.get_all_preferences()

    def get_user_preferences(self) -> List[Preferences]:
        return self.preferences_repository.get_preferences_by_type(PreferenceType.USER)

    def get_vacancy_preferences(self) -> List[Preferences]:
        return self.preferences_repository.get_preferences_by_type(
            PreferenceType.VACANCY
        )

    def update_preference(
        self,
        preference_id: int,
        title: str = None,
        preference_type: PreferenceType = None,
    ) -> Optional[Preferences]:
        return self.preferences_repository.update_preference(
            preference_id, title, preference_type
        )

    def delete_preference(self, preference_id: int) -> bool:
        return self.preferences_repository.delete_preference(preference_id)

    def preference_exists(self, preference_id: int) -> bool:
        preference = self.get_preference_by_id(preference_id)
        return preference is not None
