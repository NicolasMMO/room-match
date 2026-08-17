from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from app.enums import PreferenceResponse, PreferenceType
from pydantic import BaseModel, Field


class VacancyCreateDTO(BaseModel):
    user_id: int = Field(..., description="ID do usuário", example=1, gt=0)
    address_street: Optional[str] = Field(
        ..., description="Endereço da vaga", example="Rua das Flores, 123", min_length=5
    )
    address_neighborhood: Optional[str] = Field(
        None, description="Bairro da vaga", example="Centro", min_length=3
    )
    address_number: Optional[str] = Field(
        None, description="Número da vaga", example="123", min_length=1, max_length=5
    )

    title: str = Field(
        ...,
        description="Título do anúncio",
        example="Suíte em apê no centro",
        min_length=5,
        max_length=255,
    )
    description: Optional[str] = Field(
        None,
        description="Descrição do imóvel",
        example="Apartamento bem localizado com todas as comodidades",
    )
    rent: Decimal = Field(
        ..., description="Aluguel por pessoa (R$)", example=800.00, gt=0
    )
    available_spots: int = Field(..., description="Vagas disponíveis", example=1, gt=0)
    total_rooms: int = Field(..., description="Total de quartos", example=3, gt=0)
    photo_path: Optional[str] = Field(
        None, description="Caminho da foto principal", example="photos/vacancy_123.jpg"
    )


class VacancyUpdateDTO(BaseModel):
    user_id: Optional[int] = Field(None, description="ID do usuário", example=1, gt=0)
    address_street: Optional[str] = Field(
        None,
        description="Rua",
        example="Avenida Central",
        min_length=5,
    )
    address_neighborhood: Optional[str] = Field(
        None,
        description="Bairro",
        example="Centro",
        min_length=3,
    )
    address_number: Optional[str] = Field(
        None,
        description="Número",
        example="456",
        max_length=5,
    )
    title: Optional[str] = Field(
        None,
        description="Título do anúncio",
        example="Suíte atualizada",
        min_length=5,
        max_length=255,
    )
    description: Optional[str] = Field(
        None,
        description="Descrição do imóvel",
        example="Descrição atualizada do apartamento",
    )
    rent: Optional[Decimal] = Field(
        None, description="Aluguel por pessoa (R$)", example=850.00, gt=0
    )
    available_spots: Optional[int] = Field(
        None, description="Vagas disponíveis", example=2, gt=0
    )
    total_rooms: Optional[int] = Field(
        None, description="Total de quartos", example=4, gt=0
    )
    photo_path: Optional[str] = Field(
        None,
        description="Caminho da foto principal",
        example="photos/vacancy_123_updated.jpg",
    )


class VacancyResponseDTO(BaseModel):
    id: int = Field(..., description="ID da vaga", example=1)
    user_id: int = Field(..., description="ID do usuário", example=1)
    address_street: Optional[str] = Field(
        None, description="Rua", example="Rua das Flores"
    )
    address_neighborhood: Optional[str] = Field(
        None, description="Bairro", example="Centro"
    )
    address_number: Optional[str] = Field(None, description="Número", example="123")

    title: str = Field(
        ..., description="Título do anúncio", example="Suíte em apê no centro"
    )
    description: Optional[str] = Field(
        None, description="Descrição do imóvel", example="Apartamento bem localizado"
    )
    rent: Decimal = Field(..., description="Aluguel por pessoa (R$)", example=800.00)
    available_spots: int = Field(..., description="Vagas disponíveis", example=1)
    total_rooms: int = Field(..., description="Total de quartos", example=3)

    created_at: datetime = Field(..., description="Data de criação")
    updated_at: Optional[datetime] = Field(None, description="Data de atualização")

    model_config = {"from_attributes": True}

    @property
    def full_address(self) -> str:
        """Retorna o endereço completo formatado"""
        parts = []
        if self.address_street:
            parts.append(self.address_street)
        if self.address_number:
            parts.append(self.address_number)
        if self.address_neighborhood:
            parts.append(self.address_neighborhood)
        return ", ".join(parts) if parts else ""

    @classmethod
    def from_model(cls, vacancy) -> "VacancyResponseDTO":
        """Cria VacancyResponseDTO a partir de um modelo SQLAlchemy"""
        return cls.model_validate(vacancy)


class VacancyListResponseDTO(BaseModel):
    vacancies: list[VacancyResponseDTO]
    total: int = Field(..., description="Total de vagas")
    skip: int = Field(..., description="Itens pulados")
    limit: int = Field(..., description="Limite de itens")


class VacancyPreferenceCreateDTO(BaseModel):
    preference_id: int = Field(..., description="ID da preferência", example=1, gt=0)
    rate: PreferenceResponse = Field(
        ..., description="Resposta da preferência", example="YES"
    )


class VacancyPreferencesCreateListDTO(BaseModel):
    preferences: List[VacancyPreferenceCreateDTO] = Field(
        ..., description="Lista de preferências a serem salvas"
    )


class VacancyPreferenceResponseDTO(BaseModel):
    preference_id: int = Field(..., description="ID da preferência")
    title: str = Field(..., description="Título da preferência")
    preference_type: PreferenceType = Field(..., description="Tipo da preferência")
    rate: PreferenceResponse = Field(..., description="Resposta da preferência")

    model_config = {"from_attributes": True}


class VacancyPreferencesListResponseDTO(BaseModel):
    vacancy_id: int = Field(..., description="ID da vaga")
    preferences: List[VacancyPreferenceResponseDTO] = Field(
        ..., description="Lista de preferências"
    )
    total: int = Field(..., description="Total de preferências")
