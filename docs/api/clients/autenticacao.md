# API - Autenticação

## Visão geral

As rotas de autenticação são responsáveis por cadastro, login, logout e leitura do estado da sessão do usuário.

## Endpoints

| Método | Endpoint          | Descrição                                                     |
| ------ | ----------------- | ------------------------------------------------------------- |
| POST   | /api/v1/clients/auth/signup  | Cria um novo usuário no sistema.                              |
| POST   | /api/v1/clients/auth/signin  | Realiza login e inicia a sessão do usuário.                   |
| POST   | /api/v1/clients/auth/signout | Encerra a sessão atual.                                       |
| POST   | /api/v1/clients/auth/refresh | Reativa ou renova a sessão do usuário.                        |
| POST   | /api/v1/clients/auth/session | Define ou atualiza a sessão do usuário.                       |
| GET    | /api/v1/clients/auth/session | Retorna os dados do usuário autenticado. Requer autenticação. |
| GET    | /api/v1/clients/auth/perfil  | Retorna o perfil do usuário autenticado. Requer autenticação. |

## Observações

- As rotas protegidas usam o middleware de autenticação.
- As respostas são normalmente retornadas em JSON.
