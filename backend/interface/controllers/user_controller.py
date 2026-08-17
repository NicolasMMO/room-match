import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.auth.jwt import verify_token
from app.dependencies import get_user_service, get_vacancy_service
from app.services.user_service import UserService
from app.services.vacancy_service import VacancyService
from fastapi import APIRouter, Depends, Header, HTTPException, status
from interface.dto.user_dto import (
    UserCreateDTO,
    UserResponseDTO,
    UserUpdateDTO,
    UserWithVacanciesResponseDTO,
)
from interface.dto.vacancy_dto import VacancyResponseDTO

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserResponseDTO, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreateDTO, user_service: UserService = Depends(get_user_service)
):
    try:
        existing_user = user_service.get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        birthday = user_data.birthday

        user = user_service.create_user(
            name=user_data.name,
            email=user_data.email,
            password=user_data.password,
            birthday=birthday,
            profile_picture_path=user_data.profile_picture_path or "",
            description=user_data.description,
        )
        return UserResponseDTO.from_model(user)
    except HTTPException as he:
        raise he
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}",
        )


@router.get("/", response_model=list[UserResponseDTO])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    user_service: UserService = Depends(get_user_service),
):
    try:
        users = user_service.get_all_users(skip, limit)
        return [UserResponseDTO.from_model(user) for user in users]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing users: {str(e)}",
        )


@router.get("/me", response_model=UserWithVacanciesResponseDTO)
async def get_current_user(
    authorization: str = Header(...),
    user_service: UserService = Depends(get_user_service),
    vacancy_service: VacancyService = Depends(get_vacancy_service),
):
    try:
        token = authorization.replace("Bearer ", "")
        token_data = verify_token(token)

        if not token_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

        user = user_service.get_user_by_id(token_data.user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        vacancies = vacancy_service.get_vacancies_by_user_id(token_data.user_id)

        user_data = UserWithVacanciesResponseDTO.from_model(user)
        user_data.vacancies = [VacancyResponseDTO.from_model(v) for v in vacancies]

        return user_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching current user: {str(e)}",
        )


@router.get("/{user_id}", response_model=UserResponseDTO)
async def get_user(user_id: int, user_service: UserService = Depends(get_user_service)):
    try:
        user = user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        return UserResponseDTO.from_model(user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching user: {str(e)}",
        )


@router.put("/{user_id}", response_model=UserResponseDTO)
async def update_user(
    user_id: int,
    user_data: UserUpdateDTO,
    user_service: UserService = Depends(get_user_service),
):
    try:
        kwargs = {}
        if user_data.name is not None:
            kwargs["name"] = user_data.name
        if user_data.email is not None:
            kwargs["email"] = user_data.email
        if user_data.birthday is not None:
            kwargs["birthday"] = user_data.birthday
        if user_data.profile_picture_path is not None:
            kwargs["profile_picture_path"] = user_data.profile_picture_path
        if user_data.description is not None:
            kwargs["description"] = user_data.description

        user = user_service.update_user(user_id, **kwargs)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        return UserResponseDTO.from_model(user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating user: {str(e)}",
        )


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int, user_service: UserService = Depends(get_user_service)
):
    try:
        deleted = user_service.delete_user(user_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting user: {str(e)}",
        )
