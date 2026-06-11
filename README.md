# Tropa Livresca

Projeto full stack da Tropa Livresca, com uma interface web em React para navegacao, cadastro, login, consulta de livros/autores e fluxo de publicacao, alem de uma API Node.js/Express integrada ao Supabase para autenticacao, dados e arquivos.

## Tecnologias

- Node.js
- npm
- React
- Vite
- Express
- Supabase

## Pre-requisitos

Antes de comecar, instale:

- Node.js 20 ou superior
- npm
- Uma conta/projeto no Supabase

Tambem sera necessario ter as chaves do Supabase:

- URL do projeto
- chave anonima
- service role key

## Estrutura do projeto

```text
tropa-livresca/
  backend/   API em Node.js/Express
  frontend/  Aplicacao React/Vite
```

## Variaveis de ambiente

Use o arquivo `.env.example` como referencia. Ele fica na raiz do projeto e mostra todas as variaveis necessarias com valores ficticios.

Para desenvolvimento local, crie os arquivos abaixo:

```bash
cp .env.example backend/.env.development
cp .env.example frontend/.env
```

Depois, ajuste os valores reais em cada arquivo. O backend usa `PORT`, `NODE_ENV`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`. O frontend usa apenas as variaveis com prefixo `VITE_`.

> Nunca versione arquivos `.env` com chaves reais.

## Instalacao

Instale as dependencias da raiz, do backend e do frontend:

```bash
npm install
cd backend
npm install
cd ../frontend
npm install
cd ..
```

## Como rodar localmente

Com os arquivos de ambiente configurados, rode backend e frontend juntos a partir da raiz:

```bash
npm run dev
```

Por padrao:

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

Tambem e possivel rodar cada parte separadamente:

```bash
npm run server
npm run client
```

## Scripts disponiveis

Na raiz:

- `npm run dev`: inicia backend e frontend em paralelo
- `npm run server`: inicia apenas o backend
- `npm run client`: inicia apenas o frontend

No `backend/`:

- `npm run dev`: inicia a API com `nodemon` usando `.env.development`
- `npm start`: inicia a API em modo de producao usando `.env.production`

No `frontend/`:

- `npm run dev`: inicia o Vite
- `npm run build`: gera a build de producao
- `npm run preview`: serve a build localmente
- `npm run lint`: executa o ESLint

## Observacoes

- O backend aceita requisicoes de `http://localhost:5173` por CORS em desenvolvimento.
- A URL da API usada pelo frontend deve ser configurada em `VITE_API_URL`.
- As chaves `SUPABASE_SERVICE_ROLE_KEY` e outras credenciais sensiveis devem ficar apenas no backend.
