from decimal import Decimal
from typing import List, Optional

from app.models.vacancy_model import Vacancy
from infra.database.base_repository import BaseRepository
from sqlalchemy import delete, select, update
from sqlalchemy.sql.expression import insert


class VacancyRepository(BaseRepository):
    def create_vacancy(
        self,
        user_id: int,
        address_street: Optional[str],
        address_neighborhood: Optional[str],
        address_number: Optional[str],
        title: str,
        rent: Decimal,
        available_spots: int,
        total_rooms: int,
        description: Optional[str] = None,
        photo_path: Optional[str] = None,
    ) -> Vacancy:
        stmt = (
            insert(Vacancy)
            .values(
                user_id=user_id,
                address_street=address_street,
                address_neighborhood=address_neighborhood,
                address_number=address_number,
                title=title,
                description=description,
                rent=rent,
                available_spots=available_spots,
                total_rooms=total_rooms,
                photos_path=photo_path,
            )
            .returning(Vacancy)
        )
        result = self.execute_stmt(stmt)
        vacancy = result.scalar_one()
        self.session.flush()
        return vacancy

    def get_vacancy_by_id(self, vacancy_id: int) -> Optional[Vacancy]:
        stmt = select(Vacancy).where(Vacancy.id == vacancy_id)
        result = self.execute_stmt(stmt)
        return result.scalar_one_or_none()

    def get_all_vacancies(self, skip: int = 0, limit: int = 100) -> List[Vacancy]:
        stmt = select(Vacancy).offset(skip).limit(limit)
        result = self.execute_stmt(stmt)
        return result.scalars().all()

    def get_vacancies_by_user_id(self, user_id: int) -> List[Vacancy]:
        stmt = select(Vacancy).where(Vacancy.user_id == user_id)
        result = self.execute_stmt(stmt)
        return result.scalars().all()

    def update_vacancy(self, vacancy_id: int, **kwargs) -> Optional[Vacancy]:
        stmt = (
            update(Vacancy)
            .where(Vacancy.id == vacancy_id)
            .values(**kwargs)
            .returning(Vacancy)
        )
        result = self.execute_stmt(stmt)
        vacancy = result.scalar_one_or_none()
        if vacancy:
            self.session.flush()
        return vacancy

    def delete_vacancy(self, vacancy_id: int) -> bool:
        stmt = delete(Vacancy).where(Vacancy.id == vacancy_id)
        result = self.execute_stmt(stmt)
        return result.rowcount > 0
