import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.dependencies import (
    get_likes_repository,
    get_match_domain_service,
    get_match_repository,
)
from app.repositories.likes_repository import LikesRepository
from app.repositories.match_repository import MatchRepository
from app.services.match_domain_service import MatchDomainService
from fastapi import APIRouter, Depends, HTTPException, status
from interface.dto.like_dto import LikeDTO, LikeResponseDTO, LikerType
from interface.dto.match_dto import (
    MatchListWithDetailsResponseDTO,
    MatchWithDetailsDTO,
    UserInfoDTO,
    VacancyInfoDTO,
)
from pydantic import BaseModel

router = APIRouter(prefix="/matches", tags=["Matches"])


class UserLikesResponseDTO(BaseModel):
    vacancy_ids: list[int]


class VacancyLikesResponseDTO(BaseModel):
    user_ids: list[int]


@router.post("/like", response_model=LikeResponseDTO, status_code=status.HTTP_201_CREATED)
async def create_like(
    like_data: LikeDTO,
    match_service: MatchDomainService = Depends(get_match_domain_service),
):
    try:
        if like_data.liker == LikerType.USER:
            matched, match = match_service.user_like_vacancy(
                user_id=like_data.user_id,
                vacancy_id=like_data.vacancy_id,
            )
        else:
            matched, match = match_service.vacancy_like_user(
                vacancy_id=like_data.vacancy_id,
                user_id=like_data.user_id,
            )

        if matched and match:
            return LikeResponseDTO(
                liked=True,
                matched=True,
                match_id=match.id,
            )
        else:
            return LikeResponseDTO(
                liked=True,
                matched=False,
                match_id=None,
            )

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing like: {str(e)}",
        )


@router.get("/user/{user_id}", response_model=MatchListWithDetailsResponseDTO)
async def get_user_matches(
    user_id: int,
    match_repository: MatchRepository = Depends(get_match_repository),
):
    """Retorna matches do usuário com detalhes completos da vaga e usuário"""
    try:
        matches_data = match_repository.get_matches_with_details_by_user_id(user_id)

        match_responses = []
        for data in matches_data:
            match = data["match"]
            vacancy = data["vacancy"]
            user = data["user"]

            match_responses.append(
                MatchWithDetailsDTO(
                    id=match.id,
                    vacancy_id=match.vacancy_id,
                    user_id=match.user_id,
                    created_at=match.created_at,
                    vacancy=VacancyInfoDTO(
                        id=vacancy.id,
                        title=vacancy.title,
                        address_street=vacancy.address_street,
                        address_neighborhood=vacancy.address_neighborhood,
                        address_number=vacancy.address_number,
                        rent=vacancy.rent,
                        available_spots=vacancy.available_spots,
                        total_rooms=vacancy.total_rooms,
                    ),
                    user=UserInfoDTO(
                        id=user.id,
                        name=user.name,
                        email=user.email,
                    ),
                )
            )

        return MatchListWithDetailsResponseDTO(
            matches=match_responses,
            total=len(match_responses),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching user matches: {str(e)}",
        )


@router.get("/vacancy/{vacancy_id}", response_model=MatchListWithDetailsResponseDTO)
async def get_vacancy_matches(
    vacancy_id: int,
    match_repository: MatchRepository = Depends(get_match_repository),
):
    """Retorna matches da vaga com detalhes completos da vaga e usuário"""
    try:
        matches_data = match_repository.get_matches_with_details_by_vacancy_id(vacancy_id)

        match_responses = []
        for data in matches_data:
            match = data["match"]
            vacancy = data["vacancy"]
            user = data["user"]

            match_responses.append(
                MatchWithDetailsDTO(
                    id=match.id,
                    vacancy_id=match.vacancy_id,
                    user_id=match.user_id,
                    created_at=match.created_at,
                    vacancy=VacancyInfoDTO(
                        id=vacancy.id,
                        title=vacancy.title,
                        address_street=vacancy.address_street,
                        address_neighborhood=vacancy.address_neighborhood,
                        address_number=vacancy.address_number,
                        rent=vacancy.rent,
                        available_spots=vacancy.available_spots,
                        total_rooms=vacancy.total_rooms,
                    ),
                    user=UserInfoDTO(
                        id=user.id,
                        name=user.name,
                        email=user.email,
                    ),
                )
            )

        return MatchListWithDetailsResponseDTO(
            matches=match_responses,
            total=len(match_responses),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching vacancy matches: {str(e)}",
        )


@router.get("/user/{user_id}/likes", response_model=UserLikesResponseDTO)
async def get_user_likes(
    user_id: int,
    likes_repository: LikesRepository = Depends(get_likes_repository),
):
    """Retorna os IDs das vagas que o usuário deu like"""
    try:
        user_likes = likes_repository.get_user_liked_vacancies(user_id)
        vacancy_ids = [like.vacancy_id for like in user_likes]
        return UserLikesResponseDTO(vacancy_ids=vacancy_ids)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching user likes: {str(e)}",
        )


@router.get("/vacancy/{vacancy_id}/likes", response_model=VacancyLikesResponseDTO)
async def get_vacancy_likes(
    vacancy_id: int,
    likes_repository: LikesRepository = Depends(get_likes_repository),
):
    """Retorna os IDs dos usuários que a vaga deu like"""
    try:
        vacancy_likes = likes_repository.get_vacancy_liked_users(vacancy_id)
        user_ids = [like.user_id for like in vacancy_likes]
        return VacancyLikesResponseDTO(user_ids=user_ids)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching vacancy likes: {str(e)}",
        )
