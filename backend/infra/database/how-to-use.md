# BaseRepository - Documentação

A `BaseRepository` é uma classe simples que facilita o gerenciamento de sessões SQLAlchemy e execução de statements, permitindo que cada repositório implemente suas próprias operações CRUD conforme necessário.

## Características Principais

- **Simples e Focada**: Apenas gerenciamento de sessões e execução de statements
- **Flexível**: Cada repositório implementa suas próprias operações CRUD
- **Gerenciamento automático de sessões**: Context manager para sessões seguras
- **Suporte a statements**: Executa qualquer statement SQLAlchemy
- **Tratamento de erros**: Rollback automático em caso de erro

## Métodos Disponíveis

### Gerenciamento de Sessões

- `get_session()` - Context manager para sessões do banco de dados

### Execução de Statements

- `execute_stmt(stmt, session=None)` - Executa qualquer statement SQLAlchemy

## Como Usar

### 1. Definir um Modelo

```python
from sqlalchemy import Column, Integer, String
from infra.database.config import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True)
```

### 2. Criar um Repositório

```python
from sqlalchemy import select, insert, update, delete
from infra.database.base_repository import BaseRepository

class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__()
    
    def create_user(self, name: str, email: str):
        stmt = insert(User).values(name=name, email=email).returning(User)
        result = self.execute_stmt(stmt)
        return result.scalar_one()
    
    def get_user_by_id(self, user_id: int):
        stmt = select(User).where(User.id == user_id)
        result = self.execute_stmt(stmt)
        return result.scalar_one_or_none()
    
    def update_user(self, user_id: int, **values):
        stmt = update(User).where(User.id == user_id).values(**values).returning(User)
        result = self.execute_stmt(stmt)
        return result.scalar_one_or_none()
    
    def delete_user(self, user_id: int):
        stmt = delete(User).where(User.id == user_id)
        result = self.execute_stmt(stmt)
        return result.rowcount > 0
```

### 3. Usar o Repositório

```python
user_repo = UserRepository()

# Criar
user = user_repo.create_user("João", "joao@email.com")

# Buscar
user = user_repo.get_user_by_id(1)

# Atualizar
updated_user = user_repo.update_user(1, name="João Silva")

# Deletar
success = user_repo.delete_user(1)
```

## Tipos de Statements Suportados

A BaseRepository pode executar qualquer statement SQLAlchemy:

### SELECT
```python
from sqlalchemy import select, func

# Busca simples
stmt = select(User).where(User.id == 1)
result = self.execute_stmt(stmt)
user = result.scalar_one_or_none()

# Busca com join
stmt = select(User, Profile).join(Profile)
result = self.execute_stmt(stmt)
users_with_profiles = result.all()

# Agregações
stmt = select(func.count(User.id))
result = self.execute_stmt(stmt)
count = result.scalar()
```

### INSERT
```python
from sqlalchemy import insert

# Insert simples
stmt = insert(User).values(name="João", email="joao@email.com")
self.execute_stmt(stmt)

# Insert com returning
stmt = insert(User).values(name="João", email="joao@email.com").returning(User)
result = self.execute_stmt(stmt)
new_user = result.scalar_one()
```

### UPDATE
```python
from sqlalchemy import update

# Update simples
stmt = update(User).where(User.id == 1).values(name="João Silva")
self.execute_stmt(stmt)

# Update com returning
stmt = update(User).where(User.id == 1).values(name="João Silva").returning(User)
result = self.execute_stmt(stmt)
updated_user = result.scalar_one_or_none()
```

### DELETE
```python
from sqlalchemy import delete

# Delete simples
stmt = delete(User).where(User.id == 1)
result = self.execute_stmt(stmt)
deleted_count = result.rowcount
```

## Gerenciamento de Sessões

A BaseRepository oferece duas formas de trabalhar com sessões:

### 1. Sessão Automática (Padrão)
Os métodos criam e gerenciam suas próprias sessões automaticamente:

```python
stmt = select(User).where(User.id == 1)
result = user_repo.execute_stmt(stmt)  # Sessão criada automaticamente
```

### 2. Sessão Manual
Você pode gerenciar a sessão manualmente para transações complexas:

```python
with user_repo.get_session() as session:
    # Primeira operação
    stmt1 = insert(User).values(name="João", email="joao@email.com")
    user_repo.execute_stmt(stmt1, session)
    
    # Segunda operação
    stmt2 = insert(Profile).values(user_id=1, bio="Desenvolvedor")
    user_repo.execute_stmt(stmt2, session)
    
    # Ambas operações serão commitadas juntas
```

## Vantagens

1. **Simplicidade**: Foca apenas no essencial - sessões e execução de statements
2. **Flexibilidade**: Cada repositório implementa apenas o que precisa
3. **Controle**: Você tem controle total sobre suas queries
4. **Performance**: Usa statements modernos do SQLAlchemy 2.0+
5. **Reutilização**: Base comum para todos os repositórios
6. **Segurança**: Gerenciamento automático de sessões com rollback

## Padrões Recomendados

### Estrutura de Repositório
```python
class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__()
    
    # Operações básicas
    def create(self, **data): ...
    def get_by_id(self, id): ...
    def update(self, id, **data): ...
    def delete(self, id): ...
    
    # Operações específicas do domínio
    def get_by_email(self, email): ...
    def get_active_users(self): ...
    def search_by_name(self, pattern): ...
```

### Tratamento de Resultados
```python
# Para um resultado único
result = self.execute_stmt(stmt)
user = result.scalar_one_or_none()  # None se não encontrar

# Para múltiplos resultados
result = self.execute_stmt(stmt)
users = result.scalars().all()  # Lista de objetos

# Para contagem
result = self.execute_stmt(stmt)
count = result.scalar()  # Valor único
```
