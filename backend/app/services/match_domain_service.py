from typing import Optional

from app.models.match_model import Match
from app.repositories.likes_repository import LikesRepository
from app.repositories.match_repository import MatchRepository


class MatchDomainService:
    def __init__(
        self,
        likes_repository: LikesRepository,
        match_repository: MatchRepository,
    ):
        self.likes_repository = likes_repository
        self.match_repository = match_repository

    def vacancy_like_user(
        self, vacancy_id: int, user_id: int
    ) -> tuple[bool, Optional[Match]]:
        if vacancy_id <= 0 or user_id <= 0:
            raise ValueError("Vacancy and user IDs must be greater than zero")

        existing_like = self.likes_repository.check_vacancy_liked_user(
            vacancy_id, user_id
        )
        if existing_like:
            raise ValueError("Vacancy already liked this user")

        self.likes_repository.vacancy_like_user(vacancy_id, user_id)

        user_liked_vacancy = self.likes_repository.check_user_liked_vacancy(
            user_id, vacancy_id
        )

        if user_liked_vacancy:
            existing_match = self.match_repository.get_match_by_ids(vacancy_id, user_id)
            if not existing_match:
                match = self.match_repository.create_match(vacancy_id, user_id)
                return True, match

        return False, None

    def user_like_vacancy(
        self, user_id: int, vacancy_id: int
    ) -> tuple[bool, Optional[Match]]:
        if user_id <= 0 or vacancy_id <= 0:
            raise ValueError("User and vacancy IDs must be greater than zero")

        existing_like = self.likes_repository.check_user_liked_vacancy(
            user_id, vacancy_id
        )
        if existing_like:
            raise ValueError("User already liked this vacancy")

        self.likes_repository.user_like_vacancy(user_id, vacancy_id)

        vacancy_liked_user = self.likes_repository.check_vacancy_liked_user(
            vacancy_id, user_id
        )

        if vacancy_liked_user:
            existing_match = self.match_repository.get_match_by_ids(vacancy_id, user_id)
            if not existing_match:
                match = self.match_repository.create_match(vacancy_id, user_id)
                return True, match

        return False, None
