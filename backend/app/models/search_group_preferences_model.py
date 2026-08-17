from app.enums import PreferenceResponse
from app.models import BaseModel
from sqlalchemy import Column, Enum, ForeignKey, Integer


class SearchGroupPreferences(BaseModel):
    __tablename__ = "search_group_preferences"

    group_id = Column(Integer, ForeignKey("search_groups.id"), nullable=False)
    preference_id = Column(Integer, ForeignKey("preferences.id"), nullable=False)
    rate = Column(Enum(PreferenceResponse), nullable=False)
