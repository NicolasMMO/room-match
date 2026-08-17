from infra.database.config import Base
from sqlalchemy import Column, DateTime, Identity, Integer, func


class BaseModel(Base):
    __abstract__ = True

    id = Column(Integer, Identity(), primary_key=True)

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
