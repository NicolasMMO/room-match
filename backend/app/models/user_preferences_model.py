from app.enums import PreferenceResponse
from app.models import BaseModel
from sqlalchemy import Column, Enum, ForeignKey, Integer


class UserPreferences(BaseModel):
    __tablename__ = "user_preferences"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    preference_id = Column(Integer, ForeignKey("preferences.id"), nullable=True)
    rate = Column(Enum(PreferenceResponse), nullable=True)
