from typing import Optional

import bcrypt
from app.models.user_model import User
from app.repositories.user_repository import UserRepository
from sqlalchemy import Date


class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def create_user(
        self,
        name: str,
        email: str,
        password: str,
        birthday: Date,
        profile_picture_path: str,
        description: str = None,
    ) -> User:
        existing_user = self.user_repository.get_user_by_email(email)
        if existing_user:
            raise ValueError("Este e-mail já está cadastrado")

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        return self.user_repository.create_user(
            name=name,
            email=email,
            password=hashed_password.decode("utf-8"),
            birthday=birthday,
            profile_picture_path=profile_picture_path,
            description=description,
        )

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        return self.user_repository.get_user_by_id(user_id)

    def update_user(self, user_id: int, **kwargs) -> Optional[User]:
        return self.user_repository.update_user(user_id, **kwargs)

    def delete_user(self, user_id: int) -> bool:
        return self.user_repository.delete_user(user_id)

    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.user_repository.get_user_by_email(email)

    def get_all_users(self, skip: int = 0, limit: int = 100):
        return self.user_repository.get_all_users(skip, limit)

    def count_users(self) -> int:
        return self.user_repository.count_users()

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        user = self.user_repository.get_user_by_email(email)
        if not user:
            return None

        if not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
            return None

        return user
