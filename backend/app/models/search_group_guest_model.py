from app.models import BaseModel
from sqlalchemy import Column, ForeignKey, Integer


class SearchGroupGuest(BaseModel):
    __tablename__ = "search_group_guests"

    group_id = Column(Integer, ForeignKey("search_groups.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
