from typing import List, Optional

from app.enums import PreferenceType
from app.models.preferences_model import Preferences
from infra.database.base_repository import BaseRepository
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import delete, insert, select, update


class PreferencesRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(session)

    def create_preference(
        self, title: str, preference_type: PreferenceType
    ) -> Preferences:
        stmt = (
            insert(Preferences)
            .values(title=title, preference_type=preference_type)
            .returning(Preferences)
        )
        result = self.execute_stmt(stmt)
        preference = result.scalar_one()
        self.session.flush()
        return preference

    def get_preference_by_id(self, preference_id: int) -> Optional[Preferences]:
        stmt = select(Preferences).where(Preferences.id == preference_id)
        result = self.session.execute(stmt)
        return result.scalar_one_or_none()

    def get_all_preferences(self) -> List[Preferences]:
        stmt = select(Preferences)
        result = self.session.execute(stmt)
        return result.scalars().all()

    def get_preferences_by_type(
        self, preference_type: PreferenceType
    ) -> List[Preferences]:
        stmt = select(Preferences).where(Preferences.preference_type == preference_type)
        result = self.session.execute(stmt)
        return result.scalars().all()

    def update_preference(
        self,
        preference_id: int,
        title: str = None,
        preference_type: PreferenceType = None,
    ) -> Optional[Preferences]:
        update_data = {}
        if title is not None:
            update_data["title"] = title
        if preference_type is not None:
            update_data["preference_type"] = preference_type

        if not update_data:
            return self.get_preference_by_id(preference_id)

        stmt = (
            update(Preferences)
            .where(Preferences.id == preference_id)
            .values(**update_data)
            .returning(Preferences)
        )
        result = self.execute_stmt(stmt)
        preference = result.scalar_one_or_none()
        if preference:
            self.session.flush()
        return preference

    def delete_preference(self, preference_id: int) -> bool:
        stmt = delete(Preferences).where(Preferences.id == preference_id)
        result = self.session.execute(stmt)
        self.session.commit()
        return result.rowcount > 0
