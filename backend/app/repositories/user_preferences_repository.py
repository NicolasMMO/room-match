from typing import Dict, List, Optional

from app.enums import PreferenceResponse, PreferenceType
from app.models.preferences_model import Preferences
from app.models.user_preferences_model import UserPreferences
from infra.database.base_repository import BaseRepository
from sqlalchemy import and_
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import delete, insert, select, update


class UserPreferencesRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(session)

    def create_user_preference(
        self, user_id: int, preference_id: int, rate: PreferenceResponse
    ) -> UserPreferences:
        stmt = (
            insert(UserPreferences)
            .values(user_id=user_id, preference_id=preference_id, rate=rate)
            .returning(UserPreferences)
        )
        result = self.execute_stmt(stmt)
        user_preference = result.scalar_one()
        self.session.flush()
        return user_preference

    def get_user_preference(
        self, user_id: int, preference_id: int
    ) -> Optional[UserPreferences]:
        stmt = select(UserPreferences).where(
            and_(
                UserPreferences.user_id == user_id,
                UserPreferences.preference_id == preference_id,
            )
        )
        result = self.session.execute(stmt)
        return result.scalar_one_or_none()

    def get_user_preferences(self, user_id: int) -> List[UserPreferences]:
        stmt = select(UserPreferences).where(UserPreferences.user_id == user_id)
        result = self.session.execute(stmt)
        return result.scalars().all()

    def get_user_preferences_with_details(self, user_id: int) -> List[Dict]:
        stmt = (
            select(
                UserPreferences.rate,
                Preferences.id.label("preference_id"),
                Preferences.title,
                Preferences.preference_type,
            )
            .join(Preferences, UserPreferences.preference_id == Preferences.id)
            .where(UserPreferences.user_id == user_id)
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

    def get_user_preferences_by_type(
        self, user_id: int, preference_type: PreferenceType
    ) -> List[Dict]:
        stmt = (
            select(
                UserPreferences.rate,
                Preferences.id.label("preference_id"),
                Preferences.title,
                Preferences.preference_type,
            )
            .join(Preferences, UserPreferences.preference_id == Preferences.id)
            .where(
                and_(
                    UserPreferences.user_id == user_id,
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

    def update_user_preference(
        self, user_id: int, preference_id: int, rate: PreferenceResponse
    ) -> Optional[UserPreferences]:
        stmt = (
            update(UserPreferences)
            .where(
                and_(
                    UserPreferences.user_id == user_id,
                    UserPreferences.preference_id == preference_id,
                )
            )
            .values(rate=rate)
            .returning(UserPreferences)
        )

        result = self.execute_stmt(stmt)
        user_preference = result.scalar_one_or_none()
        if user_preference:
            self.session.flush()
        return user_preference

    def upsert_user_preference(
        self, user_id: int, preference_id: int, rate: PreferenceResponse
    ) -> UserPreferences:
        existing = self.get_user_preference(user_id, preference_id)

        if existing:
            return self.update_user_preference(user_id, preference_id, rate)
        else:
            return self.create_user_preference(user_id, preference_id, rate)

    def delete_user_preference(self, user_id: int, preference_id: int) -> bool:
        stmt = delete(UserPreferences).where(
            and_(
                UserPreferences.user_id == user_id,
                UserPreferences.preference_id == preference_id,
            )
        )
        result = self.session.execute(stmt)
        self.session.commit()
        return result.rowcount > 0

    def delete_all_user_preferences(self, user_id: int) -> bool:
        stmt = delete(UserPreferences).where(UserPreferences.user_id == user_id)
        result = self.session.execute(stmt)
        self.session.commit()
        return result.rowcount > 0

    def get_users_by_preference(
        self, preference_id: int, rate: PreferenceResponse = None
    ) -> List[int]:
        query = select(UserPreferences.user_id).where(
            UserPreferences.preference_id == preference_id
        )

        if rate:
            query = query.where(UserPreferences.rate == rate)

        result = self.session.execute(query)
        return [row[0] for row in result]
