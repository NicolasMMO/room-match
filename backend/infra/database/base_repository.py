from typing import Any

from sqlalchemy.orm import Session


class BaseRepository:
    def __init__(self, session: Session):
        self.session = session

    def execute_stmt(self, stmt: Any):
        return self.session.execute(stmt)
