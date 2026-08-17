from app.models import BaseModel
from sqlalchemy import Column, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship


class Vacancy(BaseModel):
    __tablename__ = "vacancies"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    address_street = Column(String(100))
    address_neighborhood = Column(String(100))
    address_number = Column(String(5))

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    rent = Column(Numeric(10, 2), nullable=False)
    available_spots = Column(Integer, nullable=False, default=1)
    total_rooms = Column(Integer, nullable=False, default=1)
    photos_path = Column(String(500), nullable=True)

    user = relationship("User", back_populates="vacancies")
