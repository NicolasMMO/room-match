# Makefile for Room Match API

# Detecta qual comando Docker Compose usar
DOCKER_COMPOSE := $(shell if command -v docker-compose >/dev/null 2>&1; then echo "docker-compose"; else echo "docker compose"; fi)

# Comando para executar dentro do container da aplicação
DOCKER_EXEC := $(DOCKER_COMPOSE) exec app

# Evita que o make confunda os alvos com nomes de arquivos
.PHONY: help start build up down setup-local run-local freeze-deps \
        db-migrate db-upgrade db-downgrade

# Comando padrão que exibe a ajuda
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  start         Build and start the Docker containers and run migrations"
	@echo "  build         Build the Docker images"
	@echo "  up            Start the Docker containers in detached mode"
	@echo "  down          Stop and remove the Docker containers"
	@echo "  setup-env     Create .env file from .env.example"
	@echo "  setup-local   Create a local Python virtual environment and install dependencies"
	@echo "  run-local     Run the application locally using Uvicorn"
	@echo "  freeze-deps   Update requirements.txt from local env"
	@echo ""
	@echo "Database (Alembic) Commands:"
	@echo "  db-migrate    Generate new migration from model changes"
	@echo "  db-upgrade    Apply migrations to database"
	@echo "  db-downgrade  Rollback last migration"

# --- Comandos Docker ---

# Constrói e sobe os contêineres e executa migrations
start: build up db-upgrade

# Constrói as imagens Docker
build:
	@echo "Building Docker images..."
	$(DOCKER_COMPOSE) build

# Sobe os contêineres em modo detached
up:
	@echo "Starting Docker containers..."
	$(DOCKER_COMPOSE) up -d

# Para e remove os contêineres
down:
	@echo "Stopping and removing Docker containers..."
	$(DOCKER_COMPOSE) down

# --- Comandos para Desenvolvimento Local ---

# Cria o ambiente virtual e instala as dependências
setup-env:
	@if [ ! -f .env ]; then \
		echo "Creating .env file from .env.example..."; \
		cp .env.example .env; \
	else \
		echo ".env file already exists. Skipping."; \
	fi

setup-local:
	@echo "Setting up local Python environment..."
	python3 -m venv .venv
	./.venv/bin/pip install -r requirements.txt
	@echo "Local environment created. Activate it with: source .venv/bin/activate"

# Roda a aplicação localmente com Uvicorn
run-local:
	@echo "Starting local server with Uvicorn..."
    ./.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8080

# Atualiza o requirements.txt com as dependências do ambiente virtual
freeze-deps:
	@echo "Updating requirements.txt from local environment..."
	./.venv/bin/pip freeze > requirements.txt


# --- Comandos de Banco de Dados (Alembic) ---

# Gerar nova migration a partir das mudanças nos modelos
db-migrate:
	@if [ -z "$(msg)" ]; then \
		echo "Usage: make db-migrate msg='migration_description'"; \
		echo "Example: make db-migrate msg='add_user_table'"; \
		exit 1; \
	fi
	@echo "Generating new migration: $(msg)"
	$(DOCKER_EXEC) python -m alembic revision --autogenerate -m "$(msg)"

# Aplicar todas as migrations pendentes
db-upgrade:
	@echo "Applying migrations to database..."
	$(DOCKER_EXEC) python -m alembic upgrade head

# Voltar uma migration
db-downgrade:
	@echo "Rolling back last migration..."
	$(DOCKER_EXEC) python -m alembic downgrade -1

run-front:
	@echo "Starting frontend development server..."
	cd frontend && npm install && npm run start
