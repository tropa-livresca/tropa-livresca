# API - Perfil

## Endpoints

| Método | Endpoint     | Descrição                                |
| ------ | ------------ | ---------------------------------------- |
| GET    | /api/perfil/ | Retorna o perfil do usuário autenticado  |
| PUT    | /api/perfil/ | Atualiza o perfil do usuário autenticado |

## Observações

- Ambas as rotas exigem autenticação.
- A atualização de perfil aceita upload de imagem via multipart/form-data.
