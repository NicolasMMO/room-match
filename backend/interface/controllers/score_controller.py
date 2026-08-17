import os
import sys
from datetime import datetime

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.dependencies import (
    get_score_calculator_service,
    get_user_repository,
    get_vacancy_repository,
)
from app.repositories.user_repository import UserRepository
from app.repositories.vacancy_repository import VacancyRepository
from app.services.score_calculator_service import ScoreCalculatorService
from fastapi import APIRouter, Depends, HTTPException, Query, status
from interface.dto.score_dto import (
    ScoreBatchRequestDTO,
    ScoreBatchResponseDTO,
    ScoreResultDTO,
    ScoreWithVacancyDTO,
    UsersWithScoresResponseDTO,
    UserWithScoreDTO,
    VacanciesWithScoresResponseDTO,
    VacancyWithScoreDTO,
)

router = APIRouter(prefix="/score", tags=["Score"])


@router.get(
    "/user/{user_id}/vacancy/{vacancy_id}",
    response_model=ScoreResultDTO,
    summary="Calcular score entre usuário e vaga",
    description="Calcula a porcentagem de compatibilidade entre um usuário e uma vaga específica.",
)
async def calculate_user_vacancy_score(
    user_id: int,
    vacancy_id: int,
    include_details: bool = Query(
        False, description="Incluir detalhamento do cálculo"
    ),
    score_service: ScoreCalculatorService = Depends(get_score_calculator_service),
    user_repository: UserRepository = Depends(get_user_repository),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository),
):
    # Validar existência do usuário
    user = user_repository.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuário com ID {user_id} não encontrado",
        )

    # Validar existência da vaga
    vacancy = vacancy_repository.get_vacancy_by_id(vacancy_id)
    if not vacancy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vaga com ID {vacancy_id} não encontrada",
        )

    try:
        result = score_service.calculate_user_vacancy_score(
            user_id, vacancy_id, include_details
        )
        return ScoreResultDTO(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao calcular score: {str(e)}",
        )


@router.post(
    "/batch",
    response_model=ScoreBatchResponseDTO,
    summary="Calcular scores em lote",
    description="Calcula scores de compatibilidade para múltiplas vagas de uma só vez.",
)
async def calculate_scores_batch(
    request: ScoreBatchRequestDTO,
    score_service: ScoreCalculatorService = Depends(get_score_calculator_service),
    user_repository: UserRepository = Depends(get_user_repository),
):
    # Validar existência do usuário
    user = user_repository.get_user_by_id(request.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuário com ID {request.user_id} não encontrado",
        )

    try:
        scores = score_service.calculate_scores_batch(
            request.user_id, request.vacancy_ids
        )

        return ScoreBatchResponseDTO(
            user_id=request.user_id,
            scores=[ScoreWithVacancyDTO(**score) for score in scores],
            calculated_at=datetime.utcnow().isoformat() + "Z",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao calcular scores em lote: {str(e)}",
        )


@router.get(
    "/vacancies/for-user/{user_id}",
    response_model=VacanciesWithScoresResponseDTO,
    summary="Listar vagas com scores para usuário",
    description="Retorna lista de vagas com scores de compatibilidade calculados, ordenadas por score.",
)
async def get_vacancies_with_scores_for_user(
    user_id: int,
    skip: int = Query(0, ge=0, description="Offset para paginação"),
    limit: int = Query(20, ge=1, le=100, description="Limite de resultados"),
    min_score: int = Query(0, ge=0, le=100, description="Score mínimo para filtrar"),
    score_service: ScoreCalculatorService = Depends(get_score_calculator_service),
    user_repository: UserRepository = Depends(get_user_repository),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository),
):
    # Validar existência do usuário
    user = user_repository.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuário com ID {user_id} não encontrado",
        )

    try:
        # Buscar todas as vagas
        all_vacancies = vacancy_repository.get_all_vacancies(skip=0, limit=1000)

        # Calcular scores para todas
        vacancy_ids = [v.id for v in all_vacancies]
        scores = score_service.calculate_scores_batch(user_id, vacancy_ids)

        # Criar mapa de scores
        score_map = {s["vacancy_id"]: s for s in scores}

        # Montar lista com scores e filtrar
        vacancies_with_scores = []
        for vacancy in all_vacancies:
            score_data = score_map.get(
                vacancy.id, {"percentage": 50, "level": "medium"}
            )

            if score_data["percentage"] >= min_score:
                vacancies_with_scores.append(
                    {
                        "vacancy": vacancy,
                        "score": score_data,
                    }
                )

        # Ordenar por score decrescente
        vacancies_with_scores.sort(
            key=lambda x: x["score"]["percentage"], reverse=True
        )

        # Aplicar paginação
        total = len(vacancies_with_scores)
        paginated = vacancies_with_scores[skip : skip + limit]

        # Montar response
        result_vacancies = [
            VacancyWithScoreDTO(
                id=item["vacancy"].id,
                title=item["vacancy"].title,
                rent=str(item["vacancy"].rent),
                address_neighborhood=item["vacancy"].address_neighborhood,
                match_score=ScoreResultDTO(
                    percentage=item["score"]["percentage"],
                    level=item["score"]["level"],
                ),
            )
            for item in paginated
        ]

        return VacanciesWithScoresResponseDTO(
            user_id=user_id,
            vacancies=result_vacancies,
            total=total,
            skip=skip,
            limit=limit,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao buscar vagas com scores: {str(e)}",
        )


@router.get(
    "/users/for-vacancy/{vacancy_id}",
    response_model=UsersWithScoresResponseDTO,
    summary="Listar usuários com scores para vaga",
    description="Retorna lista de usuários com scores de compatibilidade para uma vaga, ordenados por score.",
)
async def get_users_with_scores_for_vacancy(
    vacancy_id: int,
    skip: int = Query(0, ge=0, description="Offset para paginação"),
    limit: int = Query(20, ge=1, le=100, description="Limite de resultados"),
    min_score: int = Query(0, ge=0, le=100, description="Score mínimo para filtrar"),
    score_service: ScoreCalculatorService = Depends(get_score_calculator_service),
    user_repository: UserRepository = Depends(get_user_repository),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository),
):
    # Validar existência da vaga
    vacancy = vacancy_repository.get_vacancy_by_id(vacancy_id)
    if not vacancy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vaga com ID {vacancy_id} não encontrada",
        )

    try:
        # Buscar todos os usuários
        all_users = user_repository.get_all_users(skip=0, limit=1000)

        # Calcular scores para todos
        user_ids = [u.id for u in all_users]
        scores = score_service.calculate_users_scores_for_vacancy(vacancy_id, user_ids)

        # Criar mapa de scores
        score_map = {s["user_id"]: s for s in scores}

        # Montar lista com scores e filtrar
        users_with_scores = []
        for user in all_users:
            score_data = score_map.get(user.id, {"percentage": 50, "level": "medium"})

            if score_data["percentage"] >= min_score:
                users_with_scores.append(
                    {
                        "user": user,
                        "score": score_data,
                    }
                )

        # Ordenar por score decrescente
        users_with_scores.sort(key=lambda x: x["score"]["percentage"], reverse=True)

        # Aplicar paginação
        total = len(users_with_scores)
        paginated = users_with_scores[skip : skip + limit]

        # Montar response
        result_users = [
            UserWithScoreDTO(
                id=item["user"].id,
                name=item["user"].name,
                profile_picture_path=item["user"].profile_picture_path,
                match_score=ScoreResultDTO(
                    percentage=item["score"]["percentage"],
                    level=item["score"]["level"],
                ),
            )
            for item in paginated
        ]

        return UsersWithScoresResponseDTO(
            vacancy_id=vacancy_id,
            users=result_users,
            total=total,
            skip=skip,
            limit=limit,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao buscar usuários com scores: {str(e)}",
        )
