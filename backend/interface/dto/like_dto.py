from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class LikerType(str, Enum):
    USER = "user"
    VACANCY = "vacancy"


class LikeDTO(BaseModel):
    user_id: int = Field(..., description="User ID", example=1, gt=0)
    vacancy_id: int = Field(..., description="Vacancy ID", example=2, gt=0)
    liker: LikerType = Field(
        ..., description="Who is liking (user or vacancy)", example="user"
    )


class LikeResponseDTO(BaseModel):
    liked: bool = Field(
        ..., description="Whether the like was registered", example=True
    )
    matched: bool = Field(
        ..., description="Whether there was a mutual match", example=False
    )
    match_id: Optional[int] = Field(
        None, description="Match ID if it occurred", example=1
    )


class LikeRecordResponseDTO(BaseModel):
    id: int = Field(..., description="Like record ID", example=1)
    vacancy_id: int = Field(..., description="Vacancy ID", example=1)
    user_id: int = Field(..., description="User ID", example=2)
    created_at: datetime = Field(..., description="Creation date")

    model_config = {"from_attributes": True}
