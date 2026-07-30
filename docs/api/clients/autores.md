# API - Catálogo de Autores

Este documento detalha os endpoints de consulta ao catálogo de autores e seus respectivos perfis biográficos voltados para a aplicação de clientes (Clients) da plataforma Tropa Livresca.

---

## Visão Geral

* Acesso Público: Os endpoints deste módulo são totalmente públicos, não exigindo cabeçalhos de autenticação ou cookies ativos para leitura.
* Integração de Dados: A busca detalhada de um autor realiza a agregação automática das obras publicadas por ele, integrando dados do modelo de livros.
* Prefixo dos Endpoints: Todas as rotas deste módulo respondem sob o caminho base `/api/v1/clients/autores`.

---

## Tabela de Endpoints

| Método | Endpoint | Protegido | Descrição |
| :--- | :--- | :--- | :--- |
| GET | `/api/v1/clients/autores/` | Não | Retorna a listagem paginada de autores com suporte a filtros de texto. |
| GET | `/api/v1/clients/autores/:id` | Não | Retorna o perfil biográfico completo de um autor específico e suas obras. |

---

## Contratos de Dados e Comportamento Técnico

### GET `/` (Listagem de Autores)
* Parâmetros de Query (Opcionais):
  * `page`: Número da página para paginação (Padrão: 1).
  * `limit`: Quantidade de registros por página (Padrão: 10).
  * `busca`: Termo de texto para filtrar autores pelo nome.
* Resposta de Sucesso: Status `200 OK` devolvendo um objeto estruturado contendo a lista e os metadados de paginação:
  ```json
  {
    "data": [
      { "id": "autor-123", "nome": "Clarice Lispector", "biografia": "..." }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "totalItems": 1,
      "totalPages": 1
    }
  }
  ```
* Regra de Exceção: Retorna status `404 Not Found` com a mensagem `"Nenhum autor foi encontrado no catálogo."` caso a consulta ao modelo retorne uma lista vazia.

### GET `/:id` (Detalhes do Autor)
* Parâmetros de Rota: `:id` correspondente ao identificador único do autor no banco de dados.
* Parâmetros de Query (Opcionais): `page` e `limit` para gerenciar a paginação interna da lista de livros atrelada.
* Resposta de Sucesso: Status `200 OK` retornando os dados consolidados do perfil e o array de publicações:
  ```json
  {
    "data": {
      "id": "autor-123",
      "nome": "Clarice Lispector",
      "biografia": "...",
      "livros": [
        { "id": "livro-999", "titulo": "A Hora da Estrela" }
      ]
    },
    "meta": {
      "page": 1,
      "limit": 5,
      "totalItems": 1,
      "totalPages": 1
    }
  }
  ```
* Regra de Exceção: Retorna status `404 Not Found` com a mensagem `"Autor não encontrado no catálogo."` se o identificador fornecido não constar na base de dados.

---

## Observações Gerais

* Camada de Serviços: As lógicas de contagem, estruturação do objeto `meta` e amarração entre o `AutorModel` e `LivroModel` são processadas integralmente na camada `AutorService`.
* Tratamento de Erros: Falhas de infraestrutura ou erros de sintaxe no banco de dados são capturados pelo bloco `catch` e repassados ao middleware global de tratamento de erros.
