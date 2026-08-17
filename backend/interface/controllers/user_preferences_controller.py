import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from typing import Optional

from app.dependencies import get_preferences_service, get_user_preferences_service
from app.enums import PreferenceType
from app.services.preferences_service import PreferencesService
from app.services.user_preferences_service import UserPreferencesService
from fastapi import APIRouter, Depends, HTTPException, Query, status
from interface.dto.user_preferences_dto import (
    PreferenceBasicDTO,
    PreferencesListResponseDTO,
    UserPreferenceCreateDTO,
    UserPreferenceResponseDTO,
    UserPreferencesCreateListDTO,
    UserPreferencesListResponseDTO,
    UserPreferencesSummaryDTO,
)

router = APIRouter(prefix="/users", tags=["User Preferences"])


@router.get("/{user_id}/preferences", response_model=UserPreferencesListResponseDTO)
async def get_user_preferences(
    user_id: int,
    preference_type: Optional[PreferenceType] = Query(
        None, description="Filter by preference type"
    ),
    user_preferences_service: UserPreferencesService = Depends(
        get_user_preferences_service
    ),
):
    try:
        if preference_type:
            preferences_data = user_preferences_service.get_user_preferences_by_type(
                user_id, preference_type
            )
        else:
            preferences_data = user_preferences_service.get_user_preferences(user_id)

        preferences = [
            UserPreferenceResponseDTO(
                preference_id=pref["preference_id"],
                title=pref["title"],
                preference_type=pref["preference_type"],
                rate=pref["rate"],
            )
            for pref in preferences_data
        ]

        return UserPreferencesListResponseDTO(
            user_id=user_id, preferences=preferences, total=len(preferences)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao buscar preferências do usuário: {str(e)}",
        )


@router.get("/{user_id}/preferences/summary", response_model=UserPreferencesSummaryDTO)
async def get_user_preferences_summary(
    user_id: int,
    user_preferences_service: UserPreferencesService = Depends(
        get_user_preferences_service
    ),
):
    try:
        summary = user_preferences_service.get_user_preferences_summary(user_id)

        return UserPreferencesSummaryDTO(
            user_id=user_id,
            total=summary["total"],
            by_type=summary["by_type"],
            by_rate=summary["by_rate"],
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching preferences summary: {str(e)}",
        )


@router.post(
    "/{user_id}/preferences",
    response_model=UserPreferenceResponseDTO,
    status_code=status.HTTP_201_CREATED,
)
async def set_user_preference(
    user_id: int,
    preference_data: UserPreferenceCreateDTO,
    user_preferences_service: UserPreferencesService = Depends(
        get_user_preferences_service
    ),
):
    try:
        user_preferences_service.set_user_preference(
            user_id=user_id,
            preference_id=preference_data.preference_id,
            rate=preference_data.rate,
        )

        preferences_data = user_preferences_service.get_user_preferences(user_id)
        preference_detail = next(
            (
                pref
                for pref in preferences_data
                if pref["preference_id"] == preference_data.preference_id
            ),
            None,
        )

        if preference_detail:
            return UserPreferenceResponseDTO(
                preference_id=preference_detail["preference_id"],
                title=preference_detail["title"],
                preference_type=preference_detail["preference_type"],
                rate=preference_detail["rate"],
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Preference not found after creation",
            )

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error setting preference: {str(e)}",
        )


@router.post(
    "/{user_id}/preferences/bulk", response_model=UserPreferencesListResponseDTO
)
async def set_multiple_user_preferences(
    user_id: int,
    preferences_data: UserPreferencesCreateListDTO,
    user_preferences_service: UserPreferencesService = Depends(
        get_user_preferences_service
    ),
):
    try:
        preferences_list = [
            {"preference_id": pref.preference_id, "rate": pref.rate}
            for pref in preferences_data.preferences
        ]

        user_preferences_service.set_multiple_user_preferences(
            user_id, preferences_list
        )

        updated_preferences_data = user_preferences_service.get_user_preferences(
            user_id
        )
        preferences = [
            UserPreferenceResponseDTO(
                preference_id=pref["preference_id"],
                title=pref["title"],
                preference_type=pref["preference_type"],
                rate=pref["rate"],
            )
            for pref in updated_preferences_data
        ]

        return UserPreferencesListResponseDTO(
            user_id=user_id, preferences=preferences, total=len(preferences)
        )

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error setting multiple preferences: {str(e)}",
        )


@router.delete(
    "/{user_id}/preferences/{preference_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_user_preference(
    user_id: int,
    preference_id: int,
    user_preferences_service: UserPreferencesService = Depends(
        get_user_preferences_service
    ),
):
    try:
        deleted = user_preferences_service.remove_user_preference(
            user_id, preference_id
        )
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User preference not found",
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error removing preference: {str(e)}",
        )


@router.delete("/{user_id}/preferences", status_code=status.HTTP_204_NO_CONTENT)
async def delete_all_user_preferences(
    user_id: int,
    user_preferences_service: UserPreferencesService = Depends(
        get_user_preferences_service
    ),
):
    try:
        deleted = user_preferences_service.remove_all_user_preferences(user_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No preferences found for the user",
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error removing all preferences: {str(e)}",
        )


@router.get("/preferences/available", response_model=PreferencesListResponseDTO)
async def get_available_preferences(
    preference_type: Optional[PreferenceType] = Query(
        None, description="Filtrar por tipo de preferência"
    ),
    preferences_service: PreferencesService = Depends(get_preferences_service),
):
    try:
        if preference_type:
            if preference_type == PreferenceType.USER:
                preferences_data = preferences_service.get_user_preferences()
            else:
                preferences_data = preferences_service.get_vacancy_preferences()
        else:
            preferences_data = preferences_service.get_all_preferences()

        preferences = [
            PreferenceBasicDTO(
                id=pref.id,
                title=pref.title,
                preference_type=pref.preference_type,
                answer_type=pref.answer_type,
            )
            for pref in preferences_data
        ]

        by_type = {}
        for pref in preferences:
            type_key = pref.preference_type.value
            by_type[type_key] = by_type.get(type_key, 0) + 1

        return PreferencesListResponseDTO(
            preferences=preferences, total=len(preferences), by_type=by_type
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching available preferences: {str(e)}",
        )
