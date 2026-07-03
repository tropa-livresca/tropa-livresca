# API - Livros

## Endpoints

| Método | Endpoint                     | Descrição                               |
| ------ | ---------------------------- | --------------------------------------- |
| GET    | /api/livros/                 | Lista livros                            |
| POST   | /api/livros/insertLivro/:tdp | Cadastro de livro                       |
| GET    | /api/livros/:id              | Busca livros por autor ou identificador |
| POST   | /api/meuslivros/updateA/:id/ | Atualiza o status de ativo de um livro  |
| GET    | /api/meuslivros/             | Lista os livros do usuário autenticado  |

## Observações

- A rota de cadastro exige autenticação.
- O parâmetro :tdp representa o tipo de publicação.
