from typing import Dict, List, Optional

from app.enums import PreferenceResponse, PreferenceType
from app.models.user_preferences_model import UserPreferences
from app.repositories.preferences_repository import PreferencesRepository
from app.repositories.user_preferences_repository import UserPreferencesRepository


class UserPreferencesService:
    def __init__(
        self,
        user_preferences_repository: UserPreferencesRepository,
        preferences_repository: PreferencesRepository,
    ):
        self.user_preferences_repository = user_preferences_repository
        self.preferences_repository = preferences_repository

    def set_user_preference(
        self, user_id: int, preference_id: int, rate: PreferenceResponse
    ) -> UserPreferences:
        preference = self.preferences_repository.get_preference_by_id(preference_id)
        if not preference:
            raise ValueError(f"Preferência com ID {preference_id} não encontrada")

        return self.user_preferences_repository.upsert_user_preference(
            user_id, preference_id, rate
        )

    def get_user_preferences(self, user_id: int) -> List[Dict]:
        return self.user_preferences_repository.get_user_preferences_with_details(
            user_id
        )

    def get_user_preferences_by_type(
        self, user_id: int, preference_type: PreferenceType
    ) -> List[Dict]:
        return self.user_preferences_repository.get_user_preferences_by_type(
            user_id, preference_type
        )

    def get_user_preference(
        self, user_id: int, preference_id: int
    ) -> Optional[UserPreferences]:
        return self.user_preferences_repository.get_user_preference(
            user_id, preference_id
        )

    def get_user_preference_rate(
        self, user_id: int, preference_id: int
    ) -> Optional[PreferenceResponse]:
        user_preference = self.get_user_preference(user_id, preference_id)
        return user_preference.rate if user_preference else None

    def set_multiple_user_preferences(
        self, user_id: int, preferences: List[Dict]
    ) -> List[UserPreferences]:
        results = []
        for pref_data in preferences:
            preference_id = pref_data.get("preference_id")
            rate = pref_data.get("rate")

            if not preference_id or not rate:
                continue

            try:
                result = self.set_user_preference(user_id, preference_id, rate)
                results.append(result)
            except ValueError:
                continue

        return results

    def remove_user_preference(self, user_id: int, preference_id: int) -> bool:
        return self.user_preferences_repository.delete_user_preference(
            user_id, preference_id
        )

    def remove_all_user_preferences(self, user_id: int) -> bool:
        return self.user_preferences_repository.delete_all_user_preferences(user_id)

    def get_users_with_preference(
        self, preference_id: int, rate: PreferenceResponse = None
    ) -> List[int]:
        return self.user_preferences_repository.get_users_by_preference(
            preference_id, rate
        )

    def has_user_completed_preferences(
        self, user_id: int, preference_type: PreferenceType = None
    ) -> bool:
        if preference_type:
            user_preferences = self.get_user_preferences_by_type(
                user_id, preference_type
            )
        else:
            user_preferences = self.get_user_preferences(user_id)

        return len(user_preferences) > 0

    def get_user_preferences_summary(self, user_id: int) -> Dict:
        all_preferences = self.get_user_preferences(user_id)

        summary = {"total": len(all_preferences), "by_type": {}, "by_rate": {}}

        for pref in all_preferences:
            pref_type = pref["preference_type"].value
            if pref_type not in summary["by_type"]:
                summary["by_type"][pref_type] = 0
            summary["by_type"][pref_type] += 1

            rate = pref["rate"].value
            if rate not in summary["by_rate"]:
                summary["by_rate"][rate] = 0
            summary["by_rate"][rate] += 1

        return summary
