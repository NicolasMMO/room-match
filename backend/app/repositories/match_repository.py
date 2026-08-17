from typing import List, Optional

from app.models.match_model import Match
from app.models.user_model import User
from app.models.vacancy_model import Vacancy
from infra.database.base_repository import BaseRepository
from sqlalchemy import select
from sqlalchemy.sql.expression import insert


class MatchRepository(BaseRepository):
    def create_match(self, vacancy_id: int, user_id: int) -> Match:
        stmt = insert(Match).values(vacancy_id=vacancy_id, user_id=user_id).returning(Match)
        result = self.execute_stmt(stmt)
        match = result.scalar_one()
        self.session.flush()
        return match

    def get_match_by_ids(self, vacancy_id: int, user_id: int) -> Optional[Match]:
        stmt = select(Match).where(
            Match.vacancy_id == vacancy_id,
            Match.user_id == user_id,
        )
        result = self.execute_stmt(stmt)
        return result.scalar_one_or_none()

    def get_matches_by_user_id(self, user_id: int) -> List[Match]:
        stmt = select(Match).where(Match.user_id == user_id)
        result = self.execute_stmt(stmt)
        return list(result.scalars().all())

    def get_matches_by_vacancy_id(self, vacancy_id: int) -> List[Match]:
        stmt = select(Match).where(Match.vacancy_id == vacancy_id)
        result = self.execute_stmt(stmt)
        return list(result.scalars().all())

    def get_matches_with_details_by_user_id(self, user_id: int) -> List[dict]:
        """Retorna matches com detalhes da vaga e do usuário"""
        stmt = (
            select(Match, Vacancy, User)
            .join(Vacancy, Match.vacancy_id == Vacancy.id)
            .join(User, Match.user_id == User.id)
            .where(Match.user_id == user_id)
        )
        result = self.execute_stmt(stmt)

        matches_with_details = []
        for match, vacancy, user in result:
            matches_with_details.append(
                {
                    "match": match,
                    "vacancy": vacancy,
                    "user": user,
                }
            )

        return matches_with_details

    def get_matches_with_details_by_vacancy_id(self, vacancy_id: int) -> List[dict]:
        """Retorna matches com detalhes da vaga e do usuário"""
        stmt = (
            select(Match, Vacancy, User)
            .join(Vacancy, Match.vacancy_id == Vacancy.id)
            .join(User, Match.user_id == User.id)
            .where(Match.vacancy_id == vacancy_id)
        )
        result = self.execute_stmt(stmt)

        matches_with_details = []
        for match, vacancy, user in result:
            matches_with_details.append(
                {
                    "match": match,
                    "vacancy": vacancy,
                    "user": user,
                }
            )

        return matches_with_details
