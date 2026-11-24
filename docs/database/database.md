# Modelo de dados PocketBase

O modelo foi convertido do PostgreSQL/Supabase para collections PocketBase. Os registros são armazenados em SQLite e referenciados por IDs string.

## Collections principais

| Collection                  | Finalidade                                  |
| --------------------------- | ------------------------------------------- |
| `users`                     | Usuários autenticados nativos do PocketBase |
| `users_profile`             | Perfil, contato e privilégios               |
| `livros`                    | Livros e metadados editoriais               |
| `vendas`                    | Pedidos e pagamentos                        |
| `itens_venda`               | Produtos associados às vendas               |
| `avaliacoes`                | Avaliações dos livros                       |
| `movimentacoes_financeiras` | Movimentações financeiras                   |
| `enderecos`                 | Endereços das pessoas usuárias              |
| `revisoes`                  | Revisões dos livros                         |
| `storage_files`             | Arquivos em armazenamento protegido         |

## Identificadores

PocketBase cria um ID string em todas as collections. Os UUIDs e IDs numéricos do PostgreSQL não são reproduzidos automaticamente nas collections PocketBase.

Ao importar dados existentes:

1. Preserve o identificador antigo em um campo auxiliar, quando necessário.
2. Importe primeiro os usuários e perfis.
3. Importe os registros relacionados em seguida.
4. Atualize os campos `relation` com os novos IDs.

## `users_profile`

Campos definidos ou acrescentados pelas migrações:

| Campo             | Tipo       | Uso                              |
| ----------------- | ---------- | -------------------------------- |
| `nome`            | text       | Nome                             |
| `sobrenome`       | text       | Sobrenome                        |
| `telefone`        | text       | Contato                          |
| `imagem`          | file/text  | Imagem do perfil                 |
| `descricao`       | text       | Descrição                        |
| `redes_sociais`   | json       | Redes sociais                    |
| `is_admin`        | bool       | Acesso administrativo            |
| `senha_adm`       | text       | Credencial administrativa legado |
| `primeiro_acesso` | bool       | Primeiro acesso                  |
| `email`           | email/text | E-mail                           |
| `is_master`       | bool       | Privilégio master                |
| `dados_bancarios` | json       | Dados bancários                  |
| `funcao`          | text       | Função do usuário                |
| `auth_user`       | relation   | Usuário autenticado em `users`   |

## `livros`

- `direitos_de_publicacao`: bool
- `numero_edicao`: number
- `data_de_publicacao`: date
- `preco_digital`: number
- `preco_fisico`: number
- `titulo`, `subtitulo`, `descricao`: text
- `ativo`: bool
- `estado`, `idioma`, `manuscrito`: text
- `colaboradores`, `capa`: json
- `categoria`, `ISBN`: text
- `numero_paginas`: number
- `fk_user_profile_id`: relation para `users_profile`

## `vendas`

- `data`: date
- `total`: number
- `metodo_pagamento`: number
- `status_pagamento`: text
- `endereco_entrega`: json
- `status_entrega`: text
- `fk_user_profile_id`: relation para `users_profile`

## `itens_venda`

- `qtd`: number
- `subtotal`: number
- `fisico`: bool
- `preco_unitario`: number
- `fk_livros_itens_id`: relation para `livros`
- `fk_vendas_id`: relation para `vendas`

## `avaliacoes`

- `data_criacao`: date
- `qtd_estrelas`: number
- `fk_livros_id`: relation para `livros`
- `fk_user_profile_id`: relation para `users_profile`

## `movimentacoes_financeiras`

- `data`: date
- `tipo`: text
- `valor`: number
- `descricao`: text
- `status`: text
- `dados_bancarios`: json
- `fk_user_profile_id`: relation para `users_profile`
- `fk_vendas_id`: relation para `vendas`

## `enderecos`

- `estado`, `bairro`, `rua`, `cep`, `cidade`: text
- `num`: number
- `complemento`, `pais`: text
- `ativo`, `principal`: bool
- `fk_user_profile_id`: relation para `users_profile`

## `revisoes`

- `data_criacao`: date
- `apontamento`, `nome`: text
- `completado`: bool
- `arquivo`: text
- `fk_user_profile_id`: relation para `users_profile`
- `fk_livro_id`: relation para `livros`

## `storage_files`

- `owner`: text
- `bucket`: text
- `path`: text
- `file`: arquivo protegido

O índice único evita registros duplicados para o mesmo bucket e caminho.

## Relações

```text
users_profile --> livros
users_profile --> vendas
livros --> itens_venda
vendas --> itens_venda
livros --> avaliacoes
users_profile --> avaliacoes
users_profile --> movimentacoes_financeiras
vendas --> movimentacoes_financeiras
users_profile --> enderecos
users_profile --> revisoes
livros --> revisoes
users --> users_profile
```

## Backup

Faça backup do diretório `pb_data` após parar o servidor ou utilize o recurso de backup do PocketBase. Não copie apenas `data.db`; os arquivos auxiliares e o diretório de arquivos também fazem parte do estado da aplicação.
