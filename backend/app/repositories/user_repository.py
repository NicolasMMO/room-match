from typing import Optional

from app.models.user_model import User
from infra.database.base_repository import BaseRepository
from sqlalchemy import Date, delete
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import insert, select, update


class UserRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(session)

    def create_user(
        self,
        name: str,
        email: str,
        password: str,
        birthday: Date,
        profile_picture_path: str,
        description: str = None,
    ) -> User:
        stmt = (
            insert(User)
            .values(
                name=name,
                email=email,
                password=password,
                birthday=birthday,
                profile_picture_path=profile_picture_path,
                description=description,
            )
            .returning(User)
        )
        result = self.execute_stmt(stmt)
        user = result.scalar_one()
        self.session.flush()
        return user

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        stmt = select(User).where(User.id == user_id)
        result = self.execute_stmt(stmt)
        return result.scalar_one_or_none()

    def get_user_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email)
        result = self.session.execute(stmt)
        return result.scalar()

    def update_user(self, user_id: int, **kwargs) -> Optional[User]:
        stmt = update(User).where(User.id == user_id).values(**kwargs).returning(User)
        result = self.execute_stmt(stmt)
        user = result.scalar_one_or_none()
        if user:
            self.session.flush()
        return user

    def get_all_users(self, skip: int = 0, limit: int = 100):
        stmt = select(User).offset(skip).limit(limit)
        result = self.session.execute(stmt)
        return result.scalars().all()

    def count_users(self) -> int:
        stmt = select(User)
        result = self.session.execute(stmt)
        return len(result.scalars().all())

    def delete_user(self, user_id: int) -> bool:
        stmt = delete(User).where(User.id == user_id)
        result = self.session.execute(stmt)
        self.session.commit()
        return result.rowcount > 0
