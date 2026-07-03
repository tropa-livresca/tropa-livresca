# Instalação e execução

Este documento reúne as instruções de instalação e execução do projeto Tropa Livresca.

## Pré-requisitos

- Node.js 20 ou superior
- npm
- Conta e projeto no Supabase

## Variáveis de ambiente

O projeto utiliza arquivos de ambiente separados para backend e frontend. O exemplo base está disponível em [.env.example](../.env.example).

### Backend

- PORT
- NODE_ENV
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS

### Frontend

- VITE_API_URL
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

## Passo a passo

```bash
npm install
cd backend
npm install
cd ../frontend
npm install
cd ..
```

## Execução em desenvolvimento

```bash
npm run dev
```

As portas padrão são:

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

Também é possível executar cada parte separadamente:

```bash
npm run server
npm run client
```

## Scripts disponíveis

| Local    | Comando         | Função                                |
| -------- | --------------- | ------------------------------------- |
| Raiz     | npm run dev     | Inicia backend e frontend em paralelo |
| Raiz     | npm run server  | Inicia apenas o backend               |
| Raiz     | npm run client  | Inicia apenas o frontend              |
| backend  | npm run dev     | Inicia a API com nodemon              |
| backend  | npm start       | Inicia a API em modo de produção      |
| frontend | npm run dev     | Inicia o Vite                         |
| frontend | npm run build   | Gera a build de produção              |
| frontend | npm run preview | Serve a build localmente              |
| frontend | npm run lint    | Executa o ESLint                      |

> Nunca versione arquivos .env com credenciais reais.
