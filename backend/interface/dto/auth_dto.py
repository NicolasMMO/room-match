from pydantic import BaseModel, Field


class LoginDTO(BaseModel):
    email: str = Field(..., description="Email do usuário", example="joao@email.com")
    password: str = Field(..., description="password do usuário", example="password123")


class TokenDTO(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str
    email: str
