import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from infra.database.seeders.run_seeders import run_all_seeders
from interface.controllers.auth_controller import router as auth_router
from interface.controllers.match_controller import router as match_router
from interface.controllers.score_controller import router as score_router
from interface.controllers.user_controller import router as user_router
from interface.controllers.user_preferences_controller import (
    router as user_preferences_router,
)
from interface.controllers.vacancy_controller import router as vacancy_router

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Room Match API",
    description="API para sistema de busca de colegas de quarto",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


@app.on_event("startup")
async def startup_event():
    """Executa ao iniciar a aplicação."""
    logger.info("Iniciando aplicação Room Match API...")
    try:
        run_all_seeders()
    except Exception as e:
        logger.error(f"Erro durante startup: {str(e)}")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(user_router, prefix="/api/v1")
app.include_router(vacancy_router, prefix="/api/v1")
app.include_router(user_preferences_router, prefix="/api/v1")
app.include_router(match_router, prefix="/api/v1")
app.include_router(score_router, prefix="/api/v1")
