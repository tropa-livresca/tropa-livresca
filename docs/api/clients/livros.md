# API - Catálogo e Gestão de Livros

Este documento detalha os endpoints de consulta à vitrine, gerenciamento de autopublicação e controle de acervo voltados para o módulo de clientes (Clients) da plataforma Tropa Livresca.

---

## Visão Geral

* Escopo Misto: O módulo engloba rotas públicas de leitura (vitrine e detalhes) e rotas privadas de escrita protegidas por sessão (cadastro e controle de status).
* Estados de Publicação: O sistema suporta fluxos de controle de visibilidade da obra, permitindo salvar o progresso do conteúdo sob as flags de `publicado` ou `rascunho`.
* Prefixo dos Endpoints: As rotas respondem sob os caminhos base `/api/v1/clients/livros` e `/api/v1/clients/meuslivros`.

---

## Tabela de Endpoints

| Método | Endpoint | Protegido | Descrição |
| :--- | :--- | :--- | :--- |
| GET | `/api/v1/clients/livros/` | Não | Retorna a listagem paginada de livros ativos para a vitrine pública. |
| POST | `/api/v1/clients/livros/insertLivro` | Sim | Realiza o cadastro de uma nova obra no acervo da plataforma. |
| GET | `/api/v1/clients/livros/:id` | Não | Busca os detalhes consolidados de uma obra específica e seus colaboradores. |
| POST | `/api/v1/clients/meuslivros/updateA/:id/` | Sim | Altera de forma alternada o status de visibilidade ativa de um livro. |
| GET | `/api/v1/clients/meuslivros/` | Sim | Retorna a listagem exclusiva de obras vinculadas ao usuário autenticado. |

---

## Contratos de Dados e Comportamento Técnico

### GET `/api/v1/clients/livros/`
* Parâmetros de Query (Opcionais):
  * `page`: Número da página ativa para a paginação (Padrão: 1).
  * `limit`: Quantidade máxima de registros retornados por página (Padrão: 12).
  * `busca`: Termo de texto para filtrar obras por título.
* Resposta de Sucesso: Status `200 OK` retornando a lista com o parse de JSON nas URLs das capas e metadados estruturados:
  ```json
  {
    "data": [
      { "id": "livro-999", "titulo": "Dom Casmurro", "capa": { "url": "foto.jpg" } }
    ],
    "meta": {
      "page": 1,
      "limit": 12,
      "totalItems": 1,
      "totalPages": 1
    }
  }
  ```
* Regra de Exceção: Retorna status `404 Not Found` com a mensagem `"Nenhum livro foi encontrado na vitrine."` caso a base de dados retorne vazia.

### POST `/api/v1/clients/livros/insertLivro`
* Requisito de Sessão: Exige cookie `auth-token` válido interceptado pelo middleware de autenticação.
* Payload Esperado (JSON):
  ```json
  {
    "dadosLivro": {
      "titulo": "Memórias Póstumas",
      "sinopse": "..."
    },
    "publicar": true
  }
  ```
* Comportamento do Estado:
  * Se `publicar: true`: A obra é criada diretamente com status definido como `publicado`.
  * Se `publicar: false`: A obra é armazenada em formato de persistência sob o status de `rascunho`.
* Resposta de Sucesso: Status `201 Created` retornando o objeto da nova obra criada no Supabase.

### GET `/api/v1/clients/livros/:id`
* Parâmetros de Rota: `:id` correspondente ao identificador único da obra no banco de dados.
* Resposta de Sucesso: Status `200 OK` retornando os detalhes da obra acoplados à lista de profissionais vinculados por meio do `ColaboradorModel`:
  ```json
  {
    "data": {
      "id": "livro-999",
      "titulo": "Dom Casmurro",
      "capa": { "url": "foto.jpg" },
      "colaboradores": [
        { "id": "colab-1", "nome": "Machado de Assis", "funcao": "Autor" }
      ]
    }
  }
  ```
* Regra de Exceção: Retorna status `404 Not Found` com a mensagem `"O livro solicitado não existe ou está indisponível."` se o ID não constar no banco.

---

## Observações Gerais

* Tratamento de Arquivos e Capas: O método interno `_parseCapasArray` intercepta o retorno textual do banco e realiza o parse de JSON de forma segura, blindando o frontend contra strings corrompidas de mídia.
* Isolamento de Escopo Privado: As rotas sob o caminho `/meuslivros` extraem o identificador do autor diretamente das propriedades seguras do cabeçalho preenchido pelo middleware de autenticação (`req.user.id`), impedindo que um usuário visualize ou altere o status de obras de terceiros.
