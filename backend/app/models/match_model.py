from app.models import BaseModel
from sqlalchemy import Column, ForeignKey, Integer


class Match(BaseModel):
    __tablename__ = "matches"

    vacancy_id = Column(Integer, ForeignKey("vacancies.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
