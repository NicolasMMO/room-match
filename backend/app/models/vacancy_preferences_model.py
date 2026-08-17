from app.enums import PreferenceResponse
from app.models import BaseModel
from sqlalchemy import Column, Enum, ForeignKey, Integer


class VacancyPreferences(BaseModel):
    __tablename__ = "vacancy_preferences"

    vacancy_id = Column(Integer, ForeignKey("vacancies.id"))
    preference_id = Column(Integer, ForeignKey("preferences.id"))
    rate = Column(Enum(PreferenceResponse))
