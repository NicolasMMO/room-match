from typing import Dict, List

from app.enums import AnswerType, PreferenceResponse, PreferenceType
from pydantic import BaseModel, Field


class UserPreferenceResponseDTO(BaseModel):
    preference_id: int = Field(..., description="ID da preferência", example=1)
    title: str = Field(..., description="Título da preferência", example="Não fumar")
    preference_type: PreferenceType = Field(
        ..., description="Tipo da preferência", example=PreferenceType.USER
    )
    rate: PreferenceResponse = Field(
        ..., description="Avaliação do usuário", example=PreferenceResponse.YES
    )

    model_config = {"from_attributes": True}


class UserPreferencesListResponseDTO(BaseModel):
    user_id: int = Field(..., description="ID do usuário", example=1)
    preferences: List[UserPreferenceResponseDTO] = Field(
        ..., description="Lista de preferências do usuário"
    )
    total: int = Field(..., description="Total de preferências", example=5)

    model_config = {"from_attributes": True}


class UserPreferencesSummaryDTO(BaseModel):
    user_id: int = Field(..., description="ID do usuário", example=1)
    total: int = Field(..., description="Total de preferências", example=5)
    by_type: Dict[str, int] = Field(
        ...,
        description="Contagem por tipo de preferência",
        example={"user": 3, "vacancy": 2},
    )
    by_rate: Dict[str, int] = Field(
        ...,
        description="Contagem por avaliação",
        example={"YES": 3, "no": 1, "indifferent": 1},
    )

    model_config = {"from_attributes": True}


class UserPreferenceCreateDTO(BaseModel):
    preference_id: int = Field(..., description="ID da preferência", example=1)
    rate: PreferenceResponse = Field(
        ..., description="Avaliação do usuário", example=PreferenceResponse.YES
    )


class UserPreferencesCreateListDTO(BaseModel):
    preferences: List[UserPreferenceCreateDTO] = Field(
        ..., description="Lista de preferências para definir"
    )


class PreferenceBasicDTO(BaseModel):
    id: int = Field(..., description="ID da preferência", example=1)
    title: str = Field(..., description="Título da preferência", example="Não fumar")
    preference_type: PreferenceType = Field(
        ..., description="Tipo da preferência", example=PreferenceType.USER
    )
    answer_type: AnswerType = Field(
        ..., description="Tipo de resposta aceita", example=AnswerType.TERNARY
    )

    model_config = {"from_attributes": True}


class PreferencesListResponseDTO(BaseModel):
    preferences: List[PreferenceBasicDTO] = Field(
        ..., description="Lista de preferências disponíveis"
    )
    total: int = Field(..., description="Total de preferências", example=10)
    by_type: Dict[str, int] = Field(
        ..., description="Contagem por tipo", example={"user": 6, "vacancy": 4}
    )
