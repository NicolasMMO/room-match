from app.repositories.likes_repository import LikesRepository
from app.repositories.match_repository import MatchRepository
from app.repositories.preferences_repository import PreferencesRepository
from app.repositories.user_preferences_repository import UserPreferencesRepository
from app.repositories.user_repository import UserRepository
from app.repositories.vacancy_preferences_repository import VacancyPreferencesRepository
from app.repositories.vacancy_repository import VacancyRepository
from app.services.match_domain_service import MatchDomainService
from app.services.preferences_service import PreferencesService
from app.services.score_calculator_service import ScoreCalculatorService
from app.services.user_preferences_service import UserPreferencesService
from app.services.user_service import UserService
from app.services.vacancy_preferences_service import VacancyPreferencesService
from app.services.vacancy_service import VacancyService
from fastapi import Depends
from infra.database.config import get_db
from sqlalchemy.orm import Session


def get_user_repository(db: Session = Depends(get_db)) -> UserRepository:
    return UserRepository(session=db)


def get_user_service(
    user_repository: UserRepository = Depends(get_user_repository),
) -> UserService:
    return UserService(user_repository=user_repository)


def get_vacancy_repository(db: Session = Depends(get_db)) -> VacancyRepository:
    return VacancyRepository(session=db)


def get_vacancy_service(
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository),
) -> VacancyService:
    return VacancyService(vacancy_repository=vacancy_repository)


def get_preferences_repository(db: Session = Depends(get_db)) -> PreferencesRepository:
    return PreferencesRepository(session=db)


def get_user_preferences_repository(
    db: Session = Depends(get_db),
) -> UserPreferencesRepository:
    return UserPreferencesRepository(session=db)


def get_preferences_service(
    preferences_repository: PreferencesRepository = Depends(get_preferences_repository),
) -> PreferencesService:
    return PreferencesService(preferences_repository=preferences_repository)


def get_user_preferences_service(
    user_preferences_repository: UserPreferencesRepository = Depends(
        get_user_preferences_repository
    ),
    preferences_repository: PreferencesRepository = Depends(get_preferences_repository),
) -> UserPreferencesService:
    return UserPreferencesService(
        user_preferences_repository=user_preferences_repository,
        preferences_repository=preferences_repository,
    )


def get_likes_repository(db: Session = Depends(get_db)) -> LikesRepository:
    return LikesRepository(session=db)


def get_match_repository(db: Session = Depends(get_db)) -> MatchRepository:
    return MatchRepository(session=db)


def get_match_domain_service(
    likes_repository: LikesRepository = Depends(get_likes_repository),
    match_repository: MatchRepository = Depends(get_match_repository),
) -> MatchDomainService:
    return MatchDomainService(
        likes_repository=likes_repository,
        match_repository=match_repository,
    )


def get_vacancy_preferences_repository(
    db: Session = Depends(get_db),
) -> VacancyPreferencesRepository:
    return VacancyPreferencesRepository(session=db)


def get_vacancy_preferences_service(
    vacancy_preferences_repository: VacancyPreferencesRepository = Depends(
        get_vacancy_preferences_repository
    ),
    preferences_repository: PreferencesRepository = Depends(get_preferences_repository),
) -> VacancyPreferencesService:
    return VacancyPreferencesService(
        vacancy_preferences_repository=vacancy_preferences_repository,
        preferences_repository=preferences_repository,
    )


def get_score_calculator_service(
    user_preferences_repository: UserPreferencesRepository = Depends(
        get_user_preferences_repository
    ),
    vacancy_preferences_repository: VacancyPreferencesRepository = Depends(
        get_vacancy_preferences_repository
    ),
) -> ScoreCalculatorService:
    return ScoreCalculatorService(
        user_preferences_repository=user_preferences_repository,
        vacancy_preferences_repository=vacancy_preferences_repository,
    )
