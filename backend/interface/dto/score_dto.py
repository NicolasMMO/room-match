from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class ScoreResultDTO(BaseModel):
    """Resultado do cálculo de score entre usuário e vaga."""

    percentage: int = Field(
        ...,
        ge=0,
        le=100,
        description="Porcentagem de compatibilidade (0-100)",
        example=85,
    )
    level: str = Field(
        ...,
        description="Nível de compatibilidade: high, medium ou low",
        example="high",
    )
    details: Optional[Dict] = Field(
        None, description="Detalhamento do cálculo (opcional)"
    )

    model_config = {"from_attributes": True}


class ScoreWithVacancyDTO(BaseModel):
    """Score associado a uma vaga específica."""

    vacancy_id: int = Field(..., description="ID da vaga")
    percentage: int = Field(..., ge=0, le=100)
    level: str = Field(...)


class ScoreWithUserDTO(BaseModel):
    """Score associado a um usuário específico."""

    user_id: int = Field(..., description="ID do usuário")
    percentage: int = Field(..., ge=0, le=100)
    level: str = Field(...)


class ScoreBatchRequestDTO(BaseModel):
    """Request para cálculo de score em lote."""

    user_id: int = Field(..., description="ID do usuário", gt=0)
    vacancy_ids: List[int] = Field(
        ..., description="Lista de IDs das vagas", min_length=1, max_length=100
    )


class ScoreBatchResponseDTO(BaseModel):
    """Response do cálculo de score em lote."""

    user_id: int = Field(..., description="ID do usuário")
    scores: List[ScoreWithVacancyDTO] = Field(
        ..., description="Lista de scores por vaga"
    )
    calculated_at: str = Field(..., description="Timestamp do cálculo")


class VacancyWithScoreDTO(BaseModel):
    """Vaga com score de compatibilidade incluído."""

    id: int
    title: str
    rent: str
    address_neighborhood: Optional[str] = None
    match_score: ScoreResultDTO


class VacanciesWithScoresResponseDTO(BaseModel):
    """Lista de vagas com scores."""

    user_id: int
    vacancies: List[VacancyWithScoreDTO]
    total: int
    skip: int
    limit: int


class UserWithScoreDTO(BaseModel):
    """Usuário com score de compatibilidade incluído."""

    id: int
    name: str
    profile_picture_path: Optional[str] = None
    match_score: ScoreResultDTO


class UsersWithScoresResponseDTO(BaseModel):
    """Lista de usuários com scores."""

    vacancy_id: int
    users: List[UserWithScoreDTO]
    total: int
    skip: int
    limit: int
