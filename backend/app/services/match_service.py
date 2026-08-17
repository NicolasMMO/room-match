from backend.app.domains.match import Match
from backend.app.repositories.match_repository import MatchRepository
from backend.interface.dto.match_dto import MatchCreateDTO, MatchResponseDTO


class MatchService:
    def __init__(self, match_repository: MatchRepository):
        self.match_repository = match_repository

    async def create_match(self, match_data: MatchCreateDTO) -> MatchResponseDTO:
        match_model = Match(
            vacancy_id=match_data.vacancy_id, user_id=match_data.user_id
        )

        saved_match = await self.match_repository.create(match_model)

        return MatchResponseDTO.model_validate(saved_match)
