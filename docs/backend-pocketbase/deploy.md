# Deploy

O PocketBase pode ser executado como um único binário contendo servidor, banco SQLite, arquivos e painel administrativo.

## Arquitetura recomendada

- Frontend: Vercel
- API PocketBase: servidor com persistência de disco
- Dados: diretório `pb_data`
- Migrações: diretório `pb_migrations`
- Hooks: diretório `pb_hooks`

## Preparação

Antes do deploy:

1. Atualize e teste todas as migrações localmente.
2. Configure as regras de acesso das collections.
3. Configure OAuth2 e URLs permitidas.
4. Defina CORS e a URL pública do frontend.
5. Faça backup de `pb_data`.
6. Garanta que o diretório de dados possui persistência no provedor de hospedagem.

Não use armazenamento efêmero para `pb_data`, pois isso pode apagar dados e registros de migração em cada reinicialização.

## Execução em produção

No servidor, mantenha o executável e os diretórios do projeto:

```text
pocketbase/
├── pocketbase
├── pb_data/
├── pb_hooks/
└── pb_migrations/
```

Execute o servidor com:

```bash
./pocketbase serve --http=0.0.0.0:8090
```

Configure um reverse proxy HTTPS para encaminhar a porta pública ao PocketBase.

## Atualizações

Substitua o executável apenas depois de:

1. Fazer backup de `pb_data`.
2. Ler o changelog da nova versão.
3. Testar migrações e hooks em uma cópia.
4. Validar autenticação, regras e uploads.
