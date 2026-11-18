# Tropa Livresca

Aplicação web da editora fictícia Tropa Livresca, organizada como um monorepo com frontend, backend, testes e documentação.

## Estrutura do projeto

```text
tropa-livresca/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── livros/
│   │   │   │   ├── loja/
│   │   │   │   ├── movimentacoes/
│   │   │   │   ├── revisao/
│   │   │   │   └── usuarios/
│   │   │   ├── clients/
│   │   │   │   ├── autopublicacao/
│   │   │   │   ├── autores/
│   │   │   │   ├── avaliacoes/
│   │   │   │   ├── enderecos/
│   │   │   │   ├── livro/
│   │   │   │   ├── loja/
│   │   │   │   ├── movimentacoes/
│   │   │   │   ├── perfil/
│   │   │   │   └── suporte/
│   │   │   └── common/
│   │   │       ├── auth/
│   │   │       ├── config/
│   │   │       ├── middlewares/
│   │   │       ├── models/
│   │   │       └── utils/
│   │   └── api.js
│   └── tests/
│       ├── fixtures/
│       ├── helpers/
│       ├── integration/
│       │   └── routes/
│       ├── mocks/
│       └── setup/
├── frontend/
│   ├── public/
│   └── src/
│       ├── admin/
│       │   ├── components/
│       │   ├── features/
│       │   └── hooks/
│       ├── clients/
│       │   ├── components/
│       │   ├── context/
│       │   ├── features/
│       │   └── hooks/
│       ├── common/
│       │   ├── components/
│       │   ├── config/
│       │   ├── context/
│       │   ├── features/
│       │   ├── hooks/
│       │   ├── images/
│       │   ├── lib/
│       │   ├── routes/
│       │   └── services/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── docs/
│   ├── api/
│   ├── database/
│   ├── diagramas/
│   ├── funcionalidades/
│   ├── arquitetura.md
│   ├── autenticacao.md
│   ├── deploy.md
│   └── instalacao.md
├── package.json             # Workspaces e comandos para executar o projeto
├── package-lock.json        # Registro das dependências instaladas
├── CONTRIBUTING             # Orientações para contribuição
└── LICENSE                  # Licença do projeto
```

## Aplicação

- **`backend/src/api`** reúne os endpoints da API por contexto, como administração, clientes e funcionalidades compartilhadas.
- **`frontend/src`** contém as interfaces do site, organizadas entre as áreas administrativa, de clientes e componentes comuns.
- **`backend/tests`** agrupa testes unitários e de integração, com fixtures, helpers e mocks.
- **`docs`** reúne documentação de instalação, arquitetura, autenticação, API, banco de dados e funcionalidades.

## Executar em desenvolvimento

Na raiz do projeto, instale as dependências e inicie o frontend e o backend juntos:

```bash
npm install
npm run dev
```

Para instruções de configuração e execução detalhadas, consulte [`docs/instalacao.md`](docs/instalacao.md).
