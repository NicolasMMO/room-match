from datetime import timedelta

from app.auth.jwt import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token
from app.dependencies import get_user_service
from app.services.user_service import UserService
from fastapi import APIRouter, Depends, HTTPException, status
from interface.dto.auth_dto import LoginDTO, TokenDTO

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenDTO)
async def login(
    login_data: LoginDTO, user_service: UserService = Depends(get_user_service)
):
    try:
        user = user_service.authenticate_user(login_data.email, login_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        token_data = {"email": user.email, "user_id": user.id}

        access_token = create_access_token(
            data=token_data,
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return TokenDTO(
            access_token=access_token, user_id=user.id, name=user.name, email=user.email
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error logging in: {str(e)}",
        )
