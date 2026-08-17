# RoomMatch

RoomMatch é uma plataforma para busca de quartos e roommates, desenvolvida em React com TypeScript.

## 🚀 Tecnologias

- React 18
- TypeScript
- Vite (Build Tool)
- React Router DOM
- Tailwind CSS
- ESLint
- PostCSS

## 📦 Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd room-match-react

# Instale as dependências
npm install

# Execute o projeto
npm start
```

## 🛐️ Scripts Disponíveis

- `npm start` / `npm run dev` - Executa o app em modo de desenvolvimento com Vite
- `npm run build` - Cria a build de produção
- `npm run preview` - Pré-visualiza a build de produção
- `npm run lint` - Executa o linter
- `npm run lint:fix` - Executa o linter e corrige automaticamente

## 📁 Estrutura do Projeto

```
room-match-react/
├── src/               # Código fonte
│   ├── components/     # Componentes reutilizáveis
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── FormGroup/
│   │   ├── Input/
│   │   ├── Layout/
│   │   └── Logo/
│   ├── pages/         # Páginas da aplicação
│   │   └── Login/
│   ├── styles/        # Arquivo Tailwind CSS
│   ├── types/         # Definições de tipos TypeScript
│   ├── utils/         # Funções utilitárias
│   └── hooks/         # Hooks customizados
├── routes/            # 🎦 Configuração de rotas na raiz
│   ├── index.tsx      # Rotas da aplicação
│   └── types.ts       # Tipos das rotas
├── index.html         # 🎦 HTML na raiz
├── index.tsx          # 🎦 Ponto de entrada na raiz
├── main.tsx           # 🎦 Aplicação principal na raiz
└── tailwind.config.js # Configuração Tailwind
```

## 🎯 Funcionalidades

- [x] Sistema de Login
- [ ] Cadastro de usuários
- [ ] Busca de quartos
- [ ] Chat entre usuários
- [ ] Perfil de usuário

## 📄 Licença

Este projeto está sob a licença MIT.
