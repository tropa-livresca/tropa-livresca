# API - Perfil

## Endpoints

| Método | Endpoint     | Descrição                                |
| ------ | ------------ | ---------------------------------------- |
| GET    | /api/v1/clients/perfil/ | Retorna o perfil do usuário autenticado  |
| PUT    | /api/v1/clients/perfil/ | Atualiza o perfil do usuário autenticado |

## Observações

- Ambas as rotas exigem autenticação.
- A atualização de perfil aceita upload de imagem via multipart/form-data.
