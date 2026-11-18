# Backend PocketBase

Esta seção documenta a infraestrutura PocketBase usada pelo projeto Tropa Livresca como alternativa ao backend baseado em Supabase.

## Conteúdo

- [Instalação](./instalacao.md)
- [Autenticação](./autenticacao.md)
- [Banco de dados](./banco-de-dados.md)
- [Arquitetura](./arquitetura.md)
- [Deploy](./deploy.md)

## Estrutura

```text
pocketbase/
├── pocketbase.exe
├── pb_data/
├── pb_hooks/
│   └── main.pb.js
└── pb_migrations/
```

O executável inicia o servidor, a interface administrativa e as APIs REST do PocketBase. Os arquivos persistidos ficam em `pb_data`, os hooks em `pb_hooks` e as alterações de schema em `pb_migrations`.

## Comandos básicos

No Windows:

```powershell
cd pocketbase
.\pocketbase.exe serve
```

Por padrão, o servidor fica disponível em `http://127.0.0.1:8090`.
