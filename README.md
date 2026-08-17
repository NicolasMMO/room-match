# 🏠 Room Match

Este projeto é uma API desenvolvida com FastAPI para um site de busca de colegas de quarto.

## ✅ Pré-requisitos

*   **Docker & Docker Compose**: Para rodar a aplicação em contêineres.
*   **Python 3.12**: Para desenvolvimento local.
*   **Node.js**
*   **Para rodar no Windows é necessário que esteja instalado o WSL2**

---

## 🚀 Setup Inicial

### Pré requisitos 
- Para máquinas Windows instale o WSL
    - Abra o PowerShell como administrador
    - Rode o comando: `wsl --install` 
    - Reinicie o computador
    - Abra o PowerShell como administrador
    - Rode o comando: `wsl --set-default-version 2`
    - Instale a versão do Ubuntu desejada
    - Rode o comando: `wsl --list --online` e escolha a versão desejada
    - Para instalar rode o comando: `wsl --install -d <nome_da_distribuicao>`
    - Atualize pacotes: `sudo apt update && sudo apt upgrade -y`
    - Instale os programas necessários no Ubuntu
        - `sudo apt install make`
        - `sudo apt install python 3.12`
        - `sudo apt install python3-venv`
        - `sudo apt install nodejs npm`

- Instale o Docker Desktop
    - Feche WSL/Ubuntu
    - Baixe o Docker Desktop for Windows no site oficial: https://www.docker.com/products/docker-desktop
    - Instale normalmente
    - Abra o Docker Desktop e vá em: Settings > Resorces > WSL Integration
    - Ative a integração do Docker com a versão do Ubuntu instalada no WSL
    - Inicie o Ubuntu
    - Verifique o docker instalado: `docker --version`

### 1. Clone o Repositório
- Abra o Ubuntu com o WSL2
- Vá até o repositório desejado para o trabalho
- `cd <caminho_diretorio>`
- Faça um clone do repositório: `git clone <URL_DO_REPOSITORIO>`
- Vá até o diretorio do projeto: `cd room-match`

### 2. Crie o Arquivo de Ambiente
- Este comando cria o arquivo `.env` a partir do template `env.example`
- Rode o comando: `make setup-env`
- Rode o comando: `make setup-local`
*Se precisar, ajuste as variáveis no arquivo `.env` recém-criado.*

---

## 🐳 Como Rodar com Docker (Recomendado)

### 1. Construa e Suba os Contêineres ▶️
Após o setup inicial, execute o comando abaixo para iniciar a aplicação com Docker e aplicar as migrations automaticamente.
- comando: `make start`

Este comando executa:
- `make build` - Constrói as imagens Docker
- `make up` - Sobe os contêineres (PostgreSQL + FastAPI)
- `make db-upgrade` - Aplica todas as migrations pendentes

### 2. Acesse a Aplicação 🌐

A API estará disponível em [http://localhost:8080](http://localhost:8080).

#### Outros Comandos Docker

*   **Construir apenas as imagens**: `make build`
*   **Subir apenas os contêineres**: `make up`
*   **Parar os contêineres**: `make down`
*   **Ver logs da aplicação**: `docker compose logs app`
*   **Ver logs do banco**: `docker compose logs db`

### 3. Acesse o FrontEnd
- Para iniciar o front-end é necessário ir para o diretório do frontend
- No repositorio do room-match rode o comando: `cd frontend`
- Rode o comando: `npm install`
- Em seguida rode o comando: `npm start`

## 🗄️ Gerenciamento do Banco de Dados (Alembic)

O projeto utiliza **Alembic** para gerenciar migrations do banco de dados PostgreSQL.

### 📝 Como Criar e Aplicar Migrations

#### 1. Criar uma Nova Migration

Quando você modificar os modelos SQLAlchemy, gere uma migration:

```bash
make db-migrate msg='descrição_da_mudança'
```

**Exemplo:**
```bash
make db-migrate msg='add_user_avatar_field'
```

#### 2. Aplicar Migrations

Para aplicar todas as migrations pendentes:

```bash
make db-upgrade
```

#### 3. Reverter Migration

Para voltar uma migration:

```bash
make db-downgrade
```

### 🔍 Comandos de Verificação

```bash
# Verificar tabelas criadas no banco
docker compose exec db psql -U postgres -d room_match_db -c "\dt"

# Conectar diretamente no PostgreSQL
docker compose exec db psql -U postgres -d room_match_db
```

### 📊 Conexão com DBeaver/PgAdmin

```
Host: localhost
Port: 5432
Database: room_match_db
User: postgres
Password: password
```

---

## 💻 Como Rodar Localmente (Sem Docker)

### 1. Configure o Ambiente Local ⚙️

O comando `make setup-local` irá criar o `.env` (se não existir), um ambiente virtual e instalar todas as dependências.

```bash
make setup-local
```

### 2. Ative o Ambiente Virtual 🟢

```bash
# macOS/Linux
source .venv/bin/activate
```

> **Nota Importante para o VS Code:**
> Para evitar problemas de importação, selecione o interpretador do ambiente virtual no VS Code (`Cmd + Shift + P` > `Python: Select Interpreter`).

### 3. Rode a Aplicação ▶️

```bash
make run-local
```

A API estará disponível em [http://localhost:8080](http://localhost:8080).

---


## 📁 Estrutura do Projeto

A estrutura de pastas do projeto segue uma arquitetura limpa, separando as responsabilidades em camadas distintas:

```
room-match/
├── backend/                  # Código do backend (API)
│   ├── app/
│   │   ├── domains/          # Contém a lógica de negócio e entidades principais
│   │   ├── models/           # Modelos SQLAlchemy (tabelas do banco de dados)
│   │   ├── services/         # Orquestra as operações e a lógica de negócio
│   │   ├── repositories/     # Camada de acesso aos dados
│   │   │   └── user_repository.py # Repositório para operações de usuário
│   │   ├── enums.py          # Enumerações e constantes
│   │   └── main.py           # Ponto de entrada da aplicação FastAPI
│   ├── infra/
│   │   └── database/         # Configuração e acesso ao banco de dados
│   │       ├── config.py     # Configuração SQLAlchemy e sessão do banco
│   │       └── base_repository.py # Classe base para repositórios
│   ├── interface/
│   │   ├── controllers/      # Define os endpoints da API (rotas)
│   │   └── dto/              # Data Transfer Objects (ex: schemas Pydantic)
│   └── migrations/           # Migrations do Alembic
│       ├── versions/         # Arquivos de migration gerados automaticamente
│       └── env.py            # Configuração do Alembic
├── frontend/                 # Código do frontend (React)
│   └── src/
│       ├── components/       # Componentes reutilizáveis da interface
│       ├── pages/            # Páginas da aplicação (rotas)
│       ├── services/         # Comunicação com a API
│       ├── types/            # Definições de tipos TypeScript
│       └── utils/            # Funções auxiliares e utilitários
├── shared/                   # Recursos compartilhados
│   └── pictures/             # Imagens e recursos visuais
├── .env                      # Variáveis de ambiente (não commitado)
├── .env.example              # Template para as variáveis de ambiente
├── .gitignore                # Arquivos e pastas ignorados pelo Git
├── alembic.ini               # Configuração do Alembic
├── docker-compose.yml        # Orquestração dos contêineres (app e db)
├── Dockerfile                # Instruções para construir a imagem da aplicação
├── Makefile                  # Comandos de atalho para gerenciamento do projeto
├── README.md                 # Documentação do projeto (este arquivo)
└── requirements.txt          # Lista de dependências Python
```

### 🗃️ Tabelas Criadas

O projeto inclui os seguintes modelos/tabelas:

- **`users`** - Usuários do sistema
- **`preferences`** - Preferências disponíveis
- **`user_preferences`** - Relacionamento entre usuários e preferências
- **`vacancies`** - Vagas de quartos disponíveis
- **`vacancy_preferences`** - Relacionamento entre vagas e preferências
- **`matches`** - Matches entre usuários e vagas
- **`users_likes`** - Likes dados por usuários
- **`vacancies_likes`** - Likes dados em vagas

## 📦 Gerenciando Dependências

1.  **Ative o ambiente virtual**: `source .venv/bin/activate`
2.  **Instale o pacote**: `pip install <nome-do-pacote>`
3.  **Atualize o `requirements.txt`**: `make freeze-deps`
4.  **Reconstrua a imagem Docker** (se usar Docker): `make build`

**Observação**: Sempre que adicionar ou atualizar dependências, execute `make freeze-deps` para manter o `requirements.txt` atualizado.

---

## 🏗️ Arquitetura e Tecnologias

### 🛠️ Stack Tecnológica

- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy 2.0+** - ORM com suporte para async
- **Alembic** - Migrations do banco de dados
- **PostgreSQL 16** - Banco de dados relacional
- **Docker & Docker Compose** - Containerização
- **Pydantic** - Validação de dados

### 🏛️ Padrões Implementados

- **Repository Pattern** - `BaseRepository` para operações de banco
- **Clean Architecture** - Separação de responsabilidades em camadas
- **Environment Configuration** - Configuração via arquivos `.env`
- **Migration Management** - Controle de versão do banco de dados

---

### 🔄 Fluxo de Dados

```
Frontend (JSON) 
    ↓
Controller (CreateDTO) 
    ↓
Service (Domain Logic)
    ↓
Repository (Model/Entity)
    ↓
Database
    ↑
Repository (Model/Entity)
    ↑
Service (ResponseDTO)
    ↑
Controller (JSON)
    ↑
Frontend
```

---

### 📚 Comandos Úteis de Desenvolvimento

```bash
# Ver todos os comandos disponíveis
make help

# Setup completo do projeto
make setup-env && make start

# Verificar status dos containers
docker compose ps

# Verificar logs em tempo real
docker compose logs -f app

# Executar comandos dentro do container
docker compose exec app bash
```

---

## 🤝 Contribuição

1. Crie um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request