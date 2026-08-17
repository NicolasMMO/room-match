from decimal import Decimal
from typing import List, Optional

from app.models.vacancy_model import Vacancy
from app.repositories.vacancy_repository import VacancyRepository


class VacancyService:
    def __init__(self, vacancy_repository: VacancyRepository):
        self.vacancy_repository = vacancy_repository

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
        if not address_street or len(address_street.strip()) < 5:
            raise ValueError("Rua deve ter pelo menos 5 caracteres")

        if user_id <= 0:
            raise ValueError("ID do usuário deve ser válido")

        if not title or len(title.strip()) < 5:
            raise ValueError("Título deve ter pelo menos 5 caracteres")

        if len(title.strip()) > 255:
            raise ValueError("Título deve ter no máximo 255 caracteres")

        if rent <= 0:
            raise ValueError("Valor do aluguel deve ser maior que zero")

        if available_spots <= 0:
            raise ValueError("Número de vagas disponíveis deve ser maior que zero")

        if total_rooms <= 0:
            raise ValueError("Número total de quartos deve ser maior que zero")

        return self.vacancy_repository.create_vacancy(
            user_id=user_id,
            address_street=address_street,
            address_neighborhood=address_neighborhood,
            address_number=address_number,
            title=title,
            rent=rent,
            available_spots=available_spots,
            total_rooms=total_rooms,
            description=description,
            photo_path=photo_path,
        )

    def get_vacancy_by_id(self, vacancy_id: int) -> Optional[Vacancy]:
        if vacancy_id <= 0:
            raise ValueError("ID da vaga deve ser válido")

        return self.vacancy_repository.get_vacancy_by_id(vacancy_id)

    def get_all_vacancies(self, skip: int = 0, limit: int = 100) -> List[Vacancy]:
        """Lista todas as vagas com paginação."""
        # Validações de paginação
        if skip < 0:
            skip = 0
        if limit > 100:
            limit = 100
        if limit <= 0:
            limit = 10

        return self.vacancy_repository.get_all_vacancies(skip, limit)

    def get_vacancies_by_user_id(self, user_id: int) -> List[Vacancy]:
        if user_id <= 0:
            raise ValueError("ID do usuário deve ser válido")

        return self.vacancy_repository.get_vacancies_by_user_id(user_id)

    def update_vacancy(self, vacancy_id: int, **kwargs) -> Optional[Vacancy]:
        if vacancy_id <= 0:
            raise ValueError("ID da vaga deve ser válido")

        # Validações antes da atualização
        if "address" in kwargs and len(kwargs["address"].strip()) < 5:
            raise ValueError("Endereço deve ter pelo menos 5 caracteres")

        if "user_id" in kwargs and kwargs["user_id"] <= 0:
            raise ValueError("ID do usuário deve ser válido")

        if "title" in kwargs:
            if not kwargs["title"] or len(kwargs["title"].strip()) < 5:
                raise ValueError("Título deve ter pelo menos 5 caracteres")
            if len(kwargs["title"].strip()) > 255:
                raise ValueError("Título deve ter no máximo 255 caracteres")

        if "rent" in kwargs and kwargs["rent"] <= 0:
            raise ValueError("Valor do aluguel deve ser maior que zero")

        if "available_spots" in kwargs and kwargs["available_spots"] <= 0:
            raise ValueError("Número de vagas disponíveis deve ser maior que zero")

        if "total_rooms" in kwargs and kwargs["total_rooms"] <= 0:
            raise ValueError("Número total de quartos deve ser maior que zero")

        return self.vacancy_repository.update_vacancy(vacancy_id, **kwargs)

    def delete_vacancy(self, vacancy_id: int) -> bool:
        if vacancy_id <= 0:
            raise ValueError("ID da vaga deve ser válido")

        return self.vacancy_repository.delete_vacancy(vacancy_id)
