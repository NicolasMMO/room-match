import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from typing import List

from app.dependencies import get_vacancy_preferences_service, get_vacancy_service
from app.enums import PreferenceResponse
from app.services.vacancy_preferences_service import VacancyPreferencesService
from app.services.vacancy_service import VacancyService
from fastapi import APIRouter, Depends, HTTPException, Query, status
from interface.dto.vacancy_dto import (
    VacancyCreateDTO,
    VacancyListResponseDTO,
    VacancyPreferenceCreateDTO,
    VacancyPreferenceResponseDTO,
    VacancyPreferencesCreateListDTO,
    VacancyPreferencesListResponseDTO,
    VacancyResponseDTO,
    VacancyUpdateDTO,
)

router = APIRouter(prefix="/vacancies", tags=["Vacancies"])


@router.post(
    "/", response_model=VacancyResponseDTO, status_code=status.HTTP_201_CREATED
)
async def create_vacancy(
    vacancy_data: VacancyCreateDTO,
    vacancy_service: VacancyService = Depends(get_vacancy_service),
):
    try:
        vacancy = vacancy_service.create_vacancy(
            user_id=vacancy_data.user_id,
            address_street=vacancy_data.address_street,
            address_neighborhood=vacancy_data.address_neighborhood,
            address_number=vacancy_data.address_number,
            title=vacancy_data.title,
            rent=vacancy_data.rent,
            available_spots=vacancy_data.available_spots,
            total_rooms=vacancy_data.total_rooms,
            description=vacancy_data.description,
            photo_path=vacancy_data.photo_path,
        )
        return VacancyResponseDTO.from_model(vacancy)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating vacancy: {str(e)}",
        )


@router.get("/{vacancy_id}", response_model=VacancyResponseDTO)
async def get_vacancy(
    vacancy_id: int, vacancy_service: VacancyService = Depends(get_vacancy_service)
):
    try:
        vacancy = vacancy_service.get_vacancy_by_id(vacancy_id)
        if not vacancy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Vacancy not found"
            )
        return VacancyResponseDTO.from_model(vacancy)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching vacancy: {str(e)}",
        )


@router.get("/", response_model=VacancyListResponseDTO)
async def list_vacancies(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of records to return"),
    vacancy_service: VacancyService = Depends(get_vacancy_service),
):
    try:
        vacancies = vacancy_service.get_all_vacancies(skip=skip, limit=limit)
        vacancies_dto = [
            VacancyResponseDTO.from_model(vacancy) for vacancy in vacancies
        ]

        return VacancyListResponseDTO(
            vacancies=vacancies_dto, total=len(vacancies_dto), skip=skip, limit=limit
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing vacancies: {str(e)}",
        )


@router.get("/user/{user_id}", response_model=List[VacancyResponseDTO])
async def get_vacancies_by_user(
    user_id: int, vacancy_service: VacancyService = Depends(get_vacancy_service)
):
    try:
        vacancies = vacancy_service.get_vacancies_by_user_id(user_id)
        return [VacancyResponseDTO.from_model(vacancy) for vacancy in vacancies]
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching vacancies by user: {str(e)}",
        )


@router.put("/{vacancy_id}", response_model=VacancyResponseDTO)
async def update_vacancy(
    vacancy_id: int,
    vacancy_data: VacancyUpdateDTO,
    vacancy_service: VacancyService = Depends(get_vacancy_service),
):
    try:
        kwargs = {}
        if vacancy_data.user_id is not None:
            kwargs["user_id"] = vacancy_data.user_id
        if vacancy_data.address_street is not None:
            kwargs["address_street"] = vacancy_data.address_street
        if vacancy_data.address_neighborhood is not None:
            kwargs["address_neighborhood"] = vacancy_data.address_neighborhood
        if vacancy_data.address_number is not None:
            kwargs["address_number"] = vacancy_data.address_number
        if vacancy_data.title is not None:
            kwargs["title"] = vacancy_data.title
        if vacancy_data.description is not None:
            kwargs["description"] = vacancy_data.description
        if vacancy_data.rent is not None:
            kwargs["rent"] = vacancy_data.rent
        if vacancy_data.available_spots is not None:
            kwargs["available_spots"] = vacancy_data.available_spots
        if vacancy_data.total_rooms is not None:
            kwargs["total_rooms"] = vacancy_data.total_rooms
        if vacancy_data.photo_path is not None:
            kwargs["photo_path"] = vacancy_data.photo_path

        vacancy = vacancy_service.update_vacancy(vacancy_id, **kwargs)
        if not vacancy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Vacancy not found"
            )
        return VacancyResponseDTO.from_model(vacancy)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating vacancy: {str(e)}",
        )


@router.delete("/{vacancy_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vacancy(
    vacancy_id: int, vacancy_service: VacancyService = Depends(get_vacancy_service)
):
    try:
        deleted = vacancy_service.delete_vacancy(vacancy_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Vacancy not found"
            )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting vacancy: {str(e)}",
        )


@router.post(
    "/{vacancy_id}/preferences/bulk", response_model=VacancyPreferencesListResponseDTO
)
async def set_vacancy_preferences_bulk(
    vacancy_id: int,
    preferences_data: VacancyPreferencesCreateListDTO,
    vacancy_service: VacancyService = Depends(get_vacancy_service),
    vacancy_preferences_service: VacancyPreferencesService = Depends(
        get_vacancy_preferences_service
    ),
):
    try:
        vacancy = vacancy_service.get_vacancy_by_id(vacancy_id)
        if not vacancy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Vacancy not found"
            )

        preferences_list = [
            {"preference_id": pref.preference_id, "rate": pref.rate}
            for pref in preferences_data.preferences
        ]

        vacancy_preferences_service.set_multiple_vacancy_preferences(
            vacancy_id, preferences_list
        )

        saved_preferences = vacancy_preferences_service.get_vacancy_preferences(
            vacancy_id
        )

        preferences = [
            VacancyPreferenceResponseDTO(
                preference_id=pref["preference_id"],
                title=pref["title"],
                preference_type=pref["preference_type"],
                rate=pref["rate"],
            )
            for pref in saved_preferences
        ]

        return VacancyPreferencesListResponseDTO(
            vacancy_id=vacancy_id, preferences=preferences, total=len(preferences)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error setting vacancy preferences: {str(e)}",
        )


@router.get(
    "/{vacancy_id}/preferences", response_model=VacancyPreferencesListResponseDTO
)
async def get_vacancy_preferences(
    vacancy_id: int,
    vacancy_service: VacancyService = Depends(get_vacancy_service),
    vacancy_preferences_service: VacancyPreferencesService = Depends(
        get_vacancy_preferences_service
    ),
):
    try:
        vacancy = vacancy_service.get_vacancy_by_id(vacancy_id)
        if not vacancy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Vacancy not found"
            )

        preferences_data = vacancy_preferences_service.get_vacancy_preferences(
            vacancy_id
        )

        preferences = [
            VacancyPreferenceResponseDTO(
                preference_id=pref["preference_id"],
                title=pref["title"],
                preference_type=pref["preference_type"],
                rate=pref["rate"],
            )
            for pref in preferences_data
        ]

        return VacancyPreferencesListResponseDTO(
            vacancy_id=vacancy_id, preferences=preferences, total=len(preferences)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching vacancy preferences: {str(e)}",
        )
