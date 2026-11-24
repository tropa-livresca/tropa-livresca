# Banco de dados PocketBase

O projeto utiliza PocketBase como alternativa de banco de dados, autenticação e armazenamento. O PocketBase usa SQLite embutido e organiza os dados em collections.

## Arquivos relacionados

- [Modelo de dados](./database.md)
- [Hooks e funções](./funcoes.md)
- [Gatilhos de aplicação](./trigger.md)
- [Migrações PocketBase](../../pocketbase/pb_migrations/README.md)
- [Hook de criação de perfil](../../pocketbase/pb_hooks/main.pb.js)

## Estrutura local

```text
pocketbase/
├── pocketbase.exe
├── pb_data/
├── pb_hooks/
└── pb_migrations/
```

- `pb_data`: arquivos SQLite e dados persistidos.
- `pb_migrations`: criação e alteração de collections.
- `pb_hooks`: scripts executados em eventos do PocketBase.

Os arquivos `data.db`, `auxiliary.db` e seus arquivos WAL/SHM não devem ser editados diretamente.

## Inicialização

No Windows:

```powershell
cd pocketbase
.\pocketbase.exe serve
.\pocketbase.exe migrate up
```

As migrações pendentes também são aplicadas na inicialização do servidor.

## Acesso

Acesse o painel administrativo em `http://127.0.0.1:8090/_/` em ambiente local.

Defina no painel as regras `listRule`, `viewRule`, `createRule`, `updateRule` e `deleteRule` de todas as collections antes de publicar a aplicação.
