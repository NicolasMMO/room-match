from datetime import date
from typing import List, Optional

from interface.dto.vacancy_dto import VacancyResponseDTO
from pydantic import BaseModel, Field


class UserCreateDTO(BaseModel):
    name: str = Field(..., description="Nome do usuário", example="João Silva")
    email: str = Field(..., description="Email do usuário", example="joao@email.com")
    password: str = Field(..., description="password do usuário", example="password123")
    birthday: Optional[date] = Field(
        None, description="Data de nascimento", example="1990-05-15"
    )
    profile_picture_path: Optional[str] = Field(
        None, description="Caminho da foto de perfil", example="path/to/picture.jpg"
    )
    description: Optional[str] = Field(
        None,
        description="Descrição do usuário",
        example="Procuro um lugar tranquilo para morar",
    )


class UserUpdateDTO(BaseModel):
    name: Optional[str] = Field(
        None, description="Nome do usuário", example="João Silva"
    )
    email: Optional[str] = Field(
        None, description="Email do usuário", example="joao@email.com"
    )
    password: Optional[str] = Field(
        None, description="password do usuário", example="password123"
    )
    birthday: Optional[date] = Field(
        None, description="Data de nascimento", example="1990-05-15"
    )
    profile_picture_path: Optional[str] = Field(
        None, description="Caminho da foto de perfil", example="path/to/picture.jpg"
    )
    description: Optional[str] = Field(
        None,
        description="Descrição do usuário",
        example="Procuro um lugar tranquilo para morar",
    )


class UserResponseDTO(BaseModel):
    id: int = Field(..., description="ID do usuário", example=1)
    name: str = Field(..., description="Nome do usuário", example="João Silva")
    email: str = Field(..., description="Email do usuário", example="joao@email.com")
    birthday: Optional[date] = Field(
        None, description="Data de nascimento", example="1990-05-15"
    )
    profile_picture_path: Optional[str] = Field(
        None, description="Caminho da foto de perfil", example="path/to/picture.jpg"
    )
    description: Optional[str] = Field(
        None,
        description="Descrição do usuário",
        example="Procuro um lugar tranquilo para morar",
    )

    model_config = {"from_attributes": True}

    @classmethod
    def from_model(cls, user) -> "UserResponseDTO":
        return cls.model_validate(user)


class UserListResponseDTO(BaseModel):
    users: list[UserResponseDTO]
    total: int = Field(..., description="Total de usuários")
    page: int = Field(..., description="Página atual")
    per_page: int = Field(..., description="Itens por página")


class UserWithVacanciesResponseDTO(UserResponseDTO):
    vacancies: List[VacancyResponseDTO] = Field(
        default_factory=list, description="Vagas do usuário"
    )
