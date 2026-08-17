from app.models import BaseModel
from sqlalchemy import Column, ForeignKey, Integer


class UsersLikes(BaseModel):
    __tablename__ = "users_likes"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    vacancy_id = Column(Integer, ForeignKey("vacancies.id"), nullable=True)
