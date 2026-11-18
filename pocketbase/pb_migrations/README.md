# Migrações PocketBase — Tropa Livresca

## Conteúdo

- `pb_migrations/1700000000_initial_schema.js`: cria as oito collections e seus campos e relações.

## Requisitos

- PocketBase com suporte a JavaScript migrations e `RelationField` (PocketBase v0.23+).
- Executável do PocketBase na raiz do projeto.

## Instalação

Copie a pasta `pb_migrations` para a raiz do projeto PocketBase:

```text
meu-projeto/
├── pocketbase
├── pb_data/
└── pb_migrations/
    └── 1700000000_initial_schema.js
```

Execute:

```bash
./pocketbase migrate up
```

Ou inicie normalmente o servidor; migrações pendentes são aplicadas automaticamente:

```bash
./pocketbase serve
```

No Windows, use `pocketbase.exe` no lugar de `./pocketbase`.

## Decisões de conversão

1. **ID de `users_profile`:** PocketBase cria automaticamente um campo `id` próprio (string). O UUID PostgreSQL original foi mapeado para `id_supabase` (texto obrigatório). Atualize o frontend para usar o ID nativo do PocketBase nas relações; mantenha `id_supabase` apenas para interoperabilidade/importação.
2. **IDs numéricos:** os IDs `bigint`/`smallint` das tabelas PostgreSQL tornam-se IDs nativos do PocketBase. Não há equivalência direta com `IDENTITY`; durante importação, preserve os IDs antigos em campos adicionais se a correspondência numérica for necessária.
3. **Relacionamentos:** as colunas `fk_*` foram convertidas em campos `relation`. O valor desses campos passa a ser o ID string do registro relacionado, não o UUID/número antigo.
4. **Tipos:** `numeric`/`bigint`/`smallint`/`integer` foram convertidos para `number`; `jsonb` para `json`; `timestamp with time zone` e `date` para `date`; `character varying`/`text` para `text`.
5. **Nulabilidade:** PocketBase não reproduz exatamente a semântica SQL de `NULL` para todos os tipos. Campos não obrigatórios usam os valores vazios/zero do tipo PocketBase. Os campos JSON foram mantidos opcionais.
6. **Pagamento:** `metodo_pagamento` permanece numérico, pois a documentação não informa a collection/tabela de destino.
7. **Segurança:** as regras de acesso (`listRule`, `viewRule`, `createRule`, `updateRule`, `deleteRule`) não foram abertas. Configure-as de acordo com a autenticação e os papéis do projeto antes de expor a API.
8. **Autenticação:** `users_profile` foi criada como `base`, não `auth`. A documentação de origem não descreve credenciais Supabase suficientes para converter automaticamente os usuários em uma auth collection. Se o PocketBase for assumir autenticação, será necessário definir uma estratégia de migração de usuários e senhas.

## Atenção antes de produção

Esta migração cria a estrutura, não transfere registros do PostgreSQL/Supabase. Também não recria triggers, funções RPC, políticas RLS, buckets Storage, views ou regras de negócio que não aparecem na documentação fornecida. Faça backup e teste em uma instância descartável antes de aplicar em produção.
