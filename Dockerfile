# Usa a imagem oficial do Python 3.12 como base
FROM python:3.12-slim-bullseye

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo de requisitos para o diretório de trabalho
COPY requirements.txt .

# Instala as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia os arquivos necessários para o Alembic primeiro
COPY ./backend/infra ./infra
COPY ./backend/migrations ./migrations
COPY alembic.ini ./alembic.ini

# Copia todo o código do backend
COPY ./backend/app ./app
COPY ./backend/interface ./interface
COPY ./backend/main.py ./main.py

# Expõe a porta que o FastAPI usará
EXPOSE 8080

# Comando padrão que será executado quando o contêiner iniciar
# Roda a aplicação FastAPI usando Uvicorn
#CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--reload"]
CMD sh -c "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8080 --reload"
