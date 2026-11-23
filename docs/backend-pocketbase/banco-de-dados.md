# Banco de dados

O PocketBase utiliza SQLite como banco embutido e expõe os dados por meio de collections.

## Localização

- Executável: `pocketbase/pocketbase.exe`
- Dados: `pocketbase/pb_data`
- Migrações: `pocketbase/pb_migrations`
- Hooks: `pocketbase/pb_hooks`
- Tipos gerados: `pocketbase/pb_data/types.d.ts`

Os bancos `data.db` e `auxiliary.db`, além dos arquivos WAL/SHM associados, não devem ser editados manualmente.

## Collections

| Collection                  | Função                                          |
| --------------------------- | ----------------------------------------------- |
| `users`                     | Collection autenticada nativa do PocketBase     |
| `users_profile`             | Dados de perfil e privilégios da pessoa usuária |
| `livros`                    | Catálogo e metadados dos livros                 |
| `vendas`                    | Pedidos e pagamento                             |
| `itens_venda`               | Itens associados às vendas                      |
| `avaliacoes`                | Avaliações de livros                            |
| `movimentacoes_financeiras` | Movimentações e dados bancários                 |
| `enderecos`                 | Endereços das pessoas usuárias                  |
| `revisoes`                  | Revisões e apontamentos                         |
| `storage_files`             | Arquivos protegidos por bucket lógico           |

## Relações

Os campos terminados em `fk_*` são relações PocketBase. Os registros referenciados são identificados pelo ID string nativo da collection, não por UUID do PostgreSQL ou IDs numéricos originais.

As principais relações são:

- `livros.fk_user_profile_id`
- `vendas.fk_user_profile_id`
- `itens_venda.fk_livros_itens_id`
- `itens_venda.fk_vendas_id`
- `avaliacoes.fk_livros_id`
- `avaliacoes.fk_user_profile_id`
- `enderecos.fk_user_profile_id`
- `revisoes.fk_user_profile_id`
- `revisoes.fk_livro_id`

## Hook de perfil

O hook `pb_hooks/main.pb.js` cria um registro em `users_profile` após a criação de um usuário em `users`. O perfil recebe o ID do usuário em `auth_user`, além de telefone, e-mail e privilégios padrão.

## Migração de dados

A estrutura pode ser recriada pelas migrações, mas os registros existentes do Supabase/PostgreSQL não são importados automaticamente. Antes de migrar produção:

1. Exporte os dados originais.
2. Mapeie IDs antigos para campos ou relações compatíveis.
3. Importe os usuários antes dos registros relacionados.
4. Configure as regras de acesso de cada collection.
5. Faça backup de `pb_data` e teste em uma instância descartável.
