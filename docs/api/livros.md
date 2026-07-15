# API - Livros

## Endpoints

| Método | Endpoint                     | Descrição                               |
| ------ | ---------------------------- | --------------------------------------- |
| GET    | /api/livros/                 | Lista livros                            |
| POST   | /api/livros/insertLivro      | Cadastro de livro                       |
| GET    | /api/livros/:id              | Busca livros por autor ou identificador |
| POST   | /api/meuslivros/updateA/:id/ | Atualiza o status de ativo de um livro  |
| GET    | /api/meuslivros/             | Lista os livros do usuário autenticado  |

## Observações

- A rota de cadastro exige autenticação.
- A rota de criação é `POST /api/livros/insertLivro`.
- O corpo da requisição deve conter `dadosLivro` com os dados do livro e o booleano `publicar`.
  - `publicar: true` cria o livro em estado `publicado`.
  - `publicar: false` cria o livro em estado `rascunho`.
- O endpoint aceita o objeto `dadosLivro` no corpo diretamente quando necessário.
