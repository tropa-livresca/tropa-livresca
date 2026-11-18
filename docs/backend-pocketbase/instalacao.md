# Instalação

Este documento descreve a instalação local do PocketBase para o projeto Tropa Livresca.

## Pré-requisitos

- Windows com PowerShell
- Node.js 20 ou superior
- npm
- Executável PocketBase na pasta `pocketbase`

## Inicialização

Na raiz do projeto, instale as dependências e execute o PocketBase:

```powershell
npm install
cd pocketbase
.\pocketbase.exe serve
```

O painel administrativo fica disponível em `http://127.0.0.1:8090/_/`.

Crie uma conta de superusuário no primeiro acesso ao painel. As credenciais do superusuário devem ficar fora do repositório e nunca devem ser enviadas ao frontend.

## Migrações

As migrações JavaScript ficam em `pocketbase/pb_migrations`. Elas são aplicadas automaticamente na inicialização do servidor.

Para aplicar manualmente:

```powershell
cd pocketbase
.\pocketbase.exe migrate up
```

Para criar uma nova migração:

```powershell
.\pocketbase.exe migrate collections
```

## Variáveis do frontend

Ao integrar o frontend diretamente ao PocketBase, configure a URL da instância em `frontend/.env`:

```env
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

Não armazene senhas de superusuário ou outros dados sensíveis com o prefixo `VITE_`.

## Execução completa

Com a API Express e o frontend existentes, o backend pode continuar no endereço configurado em `backend/.env`. Para usar PocketBase como substituto da persistência, configure um SDK ou cliente HTTP no frontend/backend apontando para `VITE_POCKETBASE_URL` ou `POCKETBASE_URL`.
