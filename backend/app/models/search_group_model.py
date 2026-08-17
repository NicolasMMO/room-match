from app.models import BaseModel
from sqlalchemy import Column, ForeignKey, Integer, Numeric, String, Text


class SearchGroup(BaseModel):
    __tablename__ = "search_groups"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    rent = Column(Numeric(10, 2), nullable=False)
    max_roommates = Column(Integer, nullable=False, default=1)
    estimated_rooms = Column(Integer, nullable=False, default=1)
