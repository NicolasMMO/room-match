import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from dotenv import load_dotenv
from fastapi import HTTPException, status
from jose import JWTError, jwt
from pydantic import BaseModel

load_dotenv()

# Configurações do JWT
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="JWT_SECRET_KEY não configurada no ambiente",
    )

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


class TokenData(BaseModel):
    email: str
    user_id: int


def create_access_token(
    data: Dict[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    if SECRET_KEY is None:
        raise ValueError("SECRET_KEY não pode ser None")
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def verify_token(token: str) -> Optional[TokenData]:
    try:
        if SECRET_KEY is None:
            raise ValueError("SECRET_KEY não pode ser None")

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")
        user_id = payload.get("user_id")

        if not isinstance(email, str) or not isinstance(user_id, int):
            return None

        return TokenData(email=email, user_id=user_id)

    except (JWTError, ValueError):
        return None
