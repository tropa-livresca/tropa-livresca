# API - Autenticação

## Visão geral

As rotas de autenticação são responsáveis por cadastro, login, logout e leitura do estado da sessão do usuário.

## Endpoints

| Método | Endpoint          | Descrição                                                     |
| ------ | ----------------- | ------------------------------------------------------------- |
| POST   | /api/auth/signup  | Cria um novo usuário no sistema.                              |
| POST   | /api/auth/signin  | Realiza login e inicia a sessão do usuário.                   |
| POST   | /api/auth/signout | Encerra a sessão atual.                                       |
| POST   | /api/auth/refresh | Reativa ou renova a sessão do usuário.                        |
| POST   | /api/auth/session | Define ou atualiza a sessão do usuário.                       |
| GET    | /api/auth/session | Retorna os dados do usuário autenticado. Requer autenticação. |
| GET    | /api/auth/perfil  | Retorna o perfil do usuário autenticado. Requer autenticação. |

## Observações

- As rotas protegidas usam o middleware de autenticação.
- As respostas são normalmente retornadas em JSON.
