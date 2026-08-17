from app.enums import AnswerType, PreferenceType
from app.models import BaseModel
from sqlalchemy import Column, Enum, String


class Preferences(BaseModel):
    __tablename__ = "preferences"

    title = Column(String, nullable=True)
    preference_type = Column(Enum(PreferenceType), nullable=False)
    answer_type = Column(Enum(AnswerType), nullable=False, default=AnswerType.TERNARY)
