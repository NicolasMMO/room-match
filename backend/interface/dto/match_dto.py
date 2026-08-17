from datetime import datetime
from decimal import Decimal
from typing import Optional, Union

from pydantic import BaseModel, Field, field_validator


class MatchCreateDTO(BaseModel):
    vacancy_id: int = Field(..., description="ID da vaga", example=1, gt=0)
    user_id: int = Field(..., description="ID do usuário", example=1, gt=0)


class MatchUpdateDTO(BaseModel):
    vacancy_id: Optional[int] = Field(None, description="ID da vaga", example=1, gt=0)
    user_id: Optional[int] = Field(None, description="ID do usuário", example=1, gt=0)


class MatchResponseDTO(BaseModel):
    id: int = Field(..., description="ID único do match", example=1)
    vacancy_id: int = Field(..., description="ID da vaga", example=1)
    user_id: int = Field(..., description="ID do usuário", example=1)
    created_at: datetime = Field(..., description="Data de criação")
    updated_at: Optional[datetime] = Field(None, description="Data de atualização")

    model_config = {"from_attributes": True}


class VacancyInfoDTO(BaseModel):
    id: int = Field(..., description="ID da vaga")
    title: str = Field(..., description="Título da vaga")
    address_street: Optional[str] = Field(None, description="Rua")
    address_neighborhood: Optional[str] = Field(None, description="Bairro")
    address_number: Optional[str] = Field(None, description="Número")
    rent: Union[str, Decimal] = Field(..., description="Valor do aluguel")
    available_spots: int = Field(..., description="Vagas disponíveis")
    total_rooms: int = Field(..., description="Total de quartos")

    @field_validator("rent", mode="before")
    @classmethod
    def convert_rent_to_string(cls, v):
        """Converte Decimal para string"""
        if isinstance(v, Decimal):
            return str(v)
        return v


class UserInfoDTO(BaseModel):
    id: int = Field(..., description="ID do usuário")
    name: str = Field(..., description="Nome")
    email: str = Field(..., description="Email")


class MatchWithDetailsDTO(BaseModel):
    id: int = Field(..., description="ID único do match")
    vacancy_id: int = Field(..., description="ID da vaga")
    user_id: int = Field(..., description="ID do usuário")
    created_at: datetime = Field(..., description="Data de criação")
    vacancy: Optional[VacancyInfoDTO] = Field(None, description="Informações da vaga")
    user: Optional[UserInfoDTO] = Field(None, description="Informações do usuário")


class MatchListResponseDTO(BaseModel):
    matches: list[MatchResponseDTO]
    total: int = Field(..., description="Total de matches")
    page: int = Field(..., description="Página atual")
    per_page: int = Field(..., description="Itens por página")


class MatchListWithDetailsResponseDTO(BaseModel):
    matches: list[MatchWithDetailsDTO]
    total: int = Field(..., description="Total de matches")
