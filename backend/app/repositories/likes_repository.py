from typing import List, Optional

from app.models.users_likes_model import UsersLikes
from app.models.vacancies_likes_model import VacanciesLikes
from infra.database.base_repository import BaseRepository
from sqlalchemy import select
from sqlalchemy.sql.expression import insert


class LikesRepository(BaseRepository):
    def vacancy_like_user(self, vacancy_id: int, user_id: int) -> VacanciesLikes:
        stmt = insert(VacanciesLikes).values(vacancy_id=vacancy_id, user_id=user_id).returning(VacanciesLikes)
        result = self.execute_stmt(stmt)
        like_record = result.scalar_one()
        self.session.flush()
        return like_record

    def user_like_vacancy(self, user_id: int, vacancy_id: int) -> UsersLikes:
        stmt = insert(UsersLikes).values(user_id=user_id, vacancy_id=vacancy_id).returning(UsersLikes)
        result = self.execute_stmt(stmt)
        like_record = result.scalar_one()
        self.session.flush()
        return like_record

    def check_vacancy_liked_user(self, vacancy_id: int, user_id: int) -> Optional[VacanciesLikes]:
        stmt = select(VacanciesLikes).where(
            VacanciesLikes.vacancy_id == vacancy_id,
            VacanciesLikes.user_id == user_id,
        )
        result = self.execute_stmt(stmt)
        return result.scalar_one_or_none()

    def check_user_liked_vacancy(self, user_id: int, vacancy_id: int) -> Optional[UsersLikes]:
        stmt = select(UsersLikes).where(
            UsersLikes.user_id == user_id,
            UsersLikes.vacancy_id == vacancy_id,
        )
        result = self.execute_stmt(stmt)
        return result.scalar_one_or_none()

    def check_mutual_like(self, vacancy_id: int, user_id: int) -> bool:
        vacancy_liked_user = self.check_vacancy_liked_user(vacancy_id, user_id)
        user_liked_vacancy = self.check_user_liked_vacancy(user_id, vacancy_id)
        return vacancy_liked_user is not None and user_liked_vacancy is not None

    def get_user_liked_vacancies(self, user_id: int) -> List[UsersLikes]:
        """Retorna todas as vagas que o usuário deu like"""
        stmt = select(UsersLikes).where(UsersLikes.user_id == user_id)
        result = self.execute_stmt(stmt)
        return list(result.scalars().all())

    def get_vacancy_liked_users(self, vacancy_id: int) -> List[VacanciesLikes]:
        """Retorna todos os usuários que a vaga deu like"""
        stmt = select(VacanciesLikes).where(VacanciesLikes.vacancy_id == vacancy_id)
        result = self.execute_stmt(stmt)
        return list(result.scalars().all())
