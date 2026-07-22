# Instalação e Execução

Este documento reúne as instruções de instalação, configuração de ambiente e execução do projeto Tropa Livresca.

---

## Pré-requisitos

* Node.js 20 ou superior
* Gerenciador de pacotes npm
* Conta e projeto ativo no Supabase

---

## Variáveis de Ambiente

O projeto utiliza isolamento de escopo com arquivos de configuração separados para backend e frontend. Crie um arquivo `.env` na raiz de cada respectivo diretório baseando-se no modelo abaixo.

### Backend (`backend/.env`)

* `PORT`: Porta de execução do servidor Express (Padrão: 3000)
* `NODE_ENV`: Modo de ambiente da aplicação (development ou production)
* `SUPABASE_URL`: Endpoint de API do seu projeto Supabase
* `SUPABASE_ANON_KEY`: Chave pública anônima do Supabase Auth/Client
* `SUPABASE_SERVICE_ROLE_KEY`: Chave privada administrativa para bypass de políticas RLS
* `SMTP_HOST`: Endereço do servidor de e-mail de saída (ex: ://gmail.com)
* `SMTP_PORT`: Porta do servidor SMTP de e-mail (ex: 587 ou 465)
* `SMTP_USER`: Usuário ou e-mail de autenticação do serviço de correio eletrônico
* `SMTP_PASS`: Senha de aplicativo ou credencial de acesso do serviço de e-mail

### Frontend (`frontend/.env`)

* `VITE_API_URL`: URL base de comunicação com o backend Express (ex: http://localhost:3000)
* `VITE_SUPABASE_URL`: Endpoint de API do seu projeto Supabase
* `VITE_SUPABASE_ANON_KEY`: Chave pública anônima do Supabase

---

## Passo a Passo para Instalação

Execute os comandos a partir da raiz do projeto para instalar todas as dependências nos respectivos diretórios:

```bash
npm install
cd backend
npm install
cd ../frontend
npm install
cd ..
```

---

## Execução em Desenvolvimento

Para rodar o ecossistema completo simultaneamente através da automação da raiz, execute:

```bash
npm run dev
```

Endereços padrão de escuta local:

* Backend Express: http://localhost:3000
* Frontend Vite: http://localhost:5173

---

## Scripts Disponíveis

A tabela abaixo descreve as ferramentas de execução configuradas no projeto:

| Local | Comando | Função |
| :--- | :--- | :--- |
| Raiz | npm run dev | Inicializa o ecossistema (backend e frontend) em paralelo |
| Raiz | npm run server | Inicializa exclusivamente o servidor backend |
| Raiz | npm run client | Inicializa exclusivamente a aplicação frontend |
| Raiz | npm test | Executa a suíte completa de testes automatizados com node:test |
| backend | npm run dev | Inicializa a API em modo de desenvolvimento utilizando nodemon |
| backend | npm start | Inicializa a API em modo de produção puro através do Node.js |
| backend | npm test | Executa de forma isolada os testes de integração e unitários do backend |
| frontend | npm run dev | Inicializa o servidor de desenvolvimento do Vite |
| frontend | npm run build | Compila a aplicação gerando o pacote otimizado de produção |
| frontend | npm run preview | Executa um servidor local para visualizar a build de produção gerada |
| frontend | npm run lint | Dispara a análise estática de código através do ESLint |

> Nunca inclua ou versione arquivos .env contendo credenciais de produção no histórico do Git.
