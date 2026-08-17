import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configurações do banco de dados
DATABASE_URL = os.getenv(
    ("DATABASE_URL")
)

# Configurações do engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=os.getenv("DB_ECHO", "False").lower() == "true"
)

# Configuração da sessão
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base para modelos
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency para obter sessão do banco de dados.
    Garante que a sessão seja commitada e fechada após uso.
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()  # Comita as transações
    except Exception:
        db.rollback()  # Rollback em caso de erro
        raise
    finally:
        db.close()
