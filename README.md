# Tropa Livresca

![Node.js](https://img.shields.io/badge/Node.js-20%2B-blue) ![React](https://img.shields.io/badge/React-19-61DAFB) ![Vite](https://img.shields.io/badge/Vite-8-646CFF) ![Express](https://img.shields.io/badge/Express-5-000000) ![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E) ![License](https://img.shields.io/badge/License-GPLv3-green) ![Status](https://img.shields.io/badge/Status-em%20desenvolvimento-yellow)

Aplicação full stack da editora de autopublicação Tropa Livresca, desenvolvida como Trabalho de Conclusão de Curso (TCC), para oferecer uma experiência web completa de navegação, cadastro, autenticação, consulta de livros e autores, além de um fluxo de publicação e gestão de conteúdo. O projeto conta com uma interface em React/Vite e uma API em Node.js/Express integrada ao Supabase para autenticação, armazenamento de dados e arquivos.

## Índice

- [Descrição do projeto](#descrição-do-projeto)
- [Demonstração](#demonstração)
- [Funcionalidades](#funcionalidades)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Arquitetura do sistema](#arquitetura-do-sistema)
- [Estrutura de diretórios](#estrutura-de-diretórios)
- [Pré-requisitos](#pré-requisitos)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Instalação](#instalação)
- [Execução em desenvolvimento](#execução-em-desenvolvimento)
- [Scripts disponíveis](#scripts-disponíveis)
- [Configuração do Supabase](#configuração-do-supabase)
- [Fluxo da aplicação](#fluxo-da-aplicação)
- [Endpoints da API](#endpoints-da-api)
- [Autenticação e autorização](#autenticação-e-autorização)
- [Como contribuir](#como-contribuir)
- [Licença](#licença)
- [Autor](#autor)

## Descrição do projeto

A Tropa Livresca é um projeto voltado para organizar e facilitar a publicação e a descoberta de obras, autores e conteúdos relacionados à editora. O sistema foi pensado como uma solução web completa, com:

- uma interface pública para navegação e consulta;
- uma área privada para cadastro e gestão de livros;
- autenticação de usuários;
- integração com Supabase para persistência e arquivos;
- fluxo de suporte e contato.

## Demonstração

Em breve será disponibilizada uma demonstração visual do projeto.

- Screenshot/ GIF: Preencher posteriormente
- Link de demonstração: Preencher posteriormente

## Funcionalidades

A plataforma oferece um conjunto de recursos voltados à experiência do leitor, do autor e da gestão editorial.

Para detalhes completos, consulte a documentação específica em [docs/funcionalidades](docs/funcionalidades).

## Tecnologias utilizadas

### Frontend

- React
- Vite
- React Router DOM
- CSS Modules
- Axios

### Backend

- Node.js
- Express
- CORS
- Cookie Parser
- Multer
- Nodemailer

### Infraestrutura e dados

- Supabase
- dotenv
- Nodemon

## Arquitetura do sistema

A aplicação segue um modelo simples em camadas, com o frontend consumindo a API REST, que por sua vez se comunica com o Supabase para operações de dados e autenticação.

Para detalhes técnicos, consulte [docs/arquitetura.md](docs/arquitetura.md).

## Diagrama de casos de uso

O diagrama completo de casos de uso está em [docs/diagramas/caso-de-uso.puml](docs/diagramas/caso-de-uso.puml).

## Estrutura de diretórios

```text
.
├── backend/
│   ├── api/
│   │   ├── admin/
│   │   ├── clients/
│   │   └── common/
│   │       ├── config/
│   │       ├── database/
│   │       ├── middlewares/
│   │       └── models/
│   ├── api.js
│   ├── README.md
│   └── .env.example
├── docs/
│   ├── api/
│   ├── diagramas/
│   ├── funcionalidades/
│   ├── arquitetura.md
│   ├── autenticacao.md
│   ├── deploy.md
│   └── instalacao.md
├── frontend/
│   ├── public/
│   └── src/
│       ├── admin/
│       ├── clients/
│       │   ├── components/
│       │   ├── context/
│       │   ├── features/
│       │   └── hooks/
│       ├── common/
│       │   ├── components/
│       │   └── images/
│       ├── lib/
│       ├── routes/
│       ├── services/
│       ├── README.md
│       └── .env.example
├── .env.example
├── LICENSE
├── CONTRIBUTING
└── README.md
```
## Pré-requisitos

As instruções completas de instalação e configuração estão em [docs/instalacao.md](docs/instalacao.md).

## Variáveis de ambiente

As variáveis de ambiente do projeto estão descritas em [docs/instalacao.md](docs/instalacao.md).

## Instalação

Consulte [docs/instalacao.md](docs/instalacao.md) para o passo a passo completo.

## Execução em desenvolvimento

Consulte [docs/instalacao.md](docs/instalacao.md) para instruções de execução local.

## Scripts disponíveis

Os comandos disponíveis estão documentados em [docs/instalacao.md](docs/instalacao.md).

## Configuração do banco de dados

A configuração do banco de dados está detalhada em [docs/banco-de-dados.md](docs/banco-de-dados.md).

## Configuração do Supabase

As configurações do Supabase estão descritas em [docs/banco-de-dados.md](docs/banco-de-dados.md).

## Fluxo da aplicação

O fluxo principal da aplicação está documentado em [docs/autenticacao.md](docs/autenticacao.md).

## Endpoints da API

Os endpoints da API estão organizados em [docs/api](docs/api).

## Autenticação e autorização

A autenticação é realizada por meio de sessão e cookies, com validação de acesso em rotas protegidas. O middleware de autenticação é aplicado em endpoints sensíveis, como perfil e gestão de livros.

## Como contribuir

Contribuições são bem-vindas. Para colaborar, consulte o guia em [CONTRIBUTING.md](CONTRIBUTING.md).

1. Faça um fork do repositório.
2. Crie uma branch para a sua alteração.
3. Implemente a mudança com commits claros.
4. Abra um pull request descrevendo o contexto e o objetivo da alteração.

## Licença

Este projeto está licenciado sob a GNU General Public License v3.0. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autores

- David Gabriel Cardoso Pereira - Documentação
- Gabriel Rodrigues Duarte - Fullstack
- Luís Fabiano da Silva - Frontend
- Lukas Soldera Markues - Documentação
- Matheus Ruy de Almeida - Backend
- Projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) da Tropa Livresca
