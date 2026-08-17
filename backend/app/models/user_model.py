from app.models import BaseModel
from sqlalchemy import Column, Date, String
from sqlalchemy.orm import relationship


class User(BaseModel):
    __tablename__ = "users"

    name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    password = Column(String, nullable=True)
    birthday = Column(Date, nullable=True)
    profile_picture_path = Column(String, nullable=True)
    description = Column(String, nullable=True)

    vacancies = relationship("Vacancy", back_populates="user", lazy="select")
