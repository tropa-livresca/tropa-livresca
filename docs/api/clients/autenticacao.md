# API - Autenticação de Clientes

Este documento detalha os endpoints de autenticação e gerenciamento de sessão voltados para os usuários comuns (Clients) da plataforma Tropa Livresca.

---

## Visão Geral

* Mecanismo de Sessão: A autenticação é trafegada via cookies seguros HttpOnly (`auth-token` e `refresh-token`) gerenciados pelo backend Express, eliminando a persistência de tokens no localStorage do cliente.
* Renovação Automatizada: O sistema conta com um ciclo automático de atualização de sessão através do endpoint de refresh, acionado transparentemente pelo interceptador HTTP do frontend.
* Prefixo dos Endpoints: Todas as rotas deste módulo respondem sob o caminho base `/api/v1/clients/auth`.

---

## Tabela de Endpoints

| Método | Endpoint | Protegido | Descrição |
| :--- | :--- | :--- | :--- |
| POST | `/api/v1/clients/auth/signup` | Não | Registra uma nova conta de usuário/autor no sistema. |
| POST | `/api/v1/clients/auth/signin` | Não | Valida as credenciais e injeta os cookies de sessão no navegador. |
| POST | `/api/v1/clients/auth/signout` | Não | Revoga os tokens no Supabase e destrói os cookies locais. |
| POST | `/api/v1/clients/auth/refresh` | Não | Renova o token de acesso utilizando o cookie de atualização expirado. |
| POST | `/api/v1/clients/auth/session` | Não | Recebe tokens externos para sincronização e gravação de cookies. |
| GET | `/api/v1/clients/auth/session` | Sim | Retorna os metadados do usuário ativo extraídos do token validado. |
| GET | `/api/v1/clients/auth/perfil` | Sim | Retorna os dados detalhados do perfil vinculado ao usuário autenticado. |

---

## Contratos de Dados e Comportamento Técnico

### POST `/signup`
* Payload Esperado (JSON): `{ "email": "...", "password": "...", "nome": "...", "telefone": "..." }`
* Resposta de Sucesso: Status `201 Created` contendo o objeto do usuário criado e mensagem orientando a validação de e-mail.
* Regra de Exceção: Retorna status `400 Bad Request` se houver campos obrigatórios vazios ou se o e-mail já constar na base de dados.

### POST `/signin`
* Payload Esperado (JSON): `{ "email": "...", "password": "..." }`
* Resposta de Sucesso: Status `200 OK` devolvendo o payload do usuário no corpo e injetando as chaves `auth-token` e `refresh-token` nos cabeçalhos `Set-Cookie`.
* Atributos do Cookie: Gravados com propriedades `httpOnly: true` e `sameSite: "lax"` para blindagem contra ataques XSS e compatibilidade em ambiente de desenvolvimento local.

### GET `/session`
* Requisito de Cabeçalho: O navegador deve trafegar automaticamente o cookie `auth-token` válido.
* Resposta de Sucesso: Status `200 OK` contendo `{ "user": { "id": "...", "email": "..." } }`.
* Regra de Exceção: Caso o token esteja ausente, corrompido ou expirado, o middleware `checkAuth` intercepta a chamada, bloqueia a execução do controlador e retorna status `401 Unauthorized`.

---

## Observações Gerais

* Middleware de Proteção: As rotas sinalizadas como protegidas aplicam obrigatoriamente o middleware `checkAuth` antes da execução do controlador, interceptando falhas de credenciais e encaminhando-as ao manipulador global de erros (`errorHandler`).
* Respostas Padronizadas: Todas as payloads de resposta e mensagens de erro são trafegadas no formato estruturado JSON.
