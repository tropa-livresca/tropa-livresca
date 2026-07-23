# Tropa Livresca

![Node.js](https://img.shields.io/badge/Node.js-20%2B-blue) ![React](https://img.shields.io/badge/React-19-61DAFB) ![Vite](https://img.shields.io/badge/Vite-8-646CFF) ![Express](https://img.shields.io/badge/Express-5-000000) ![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E) ![License](https://img.shields.io/badge/License-GPLv3-green) ![Status](https://img.shields.io/badge/Status-em%20desenvolvimento-yellow)

Aplicação full stack da editora de autopublicação Tropa Livresca, desenvolvida como Trabalho de Conclusão de Curso (TCC), para oferecer uma experiência web completa de navegação, cadastro, autenticação, consulta de livros e autores, além de um fluxo de publicação e gestão de conteúdo. O projeto conta com uma interface em React/Vite e uma API em Node.js/Express integrada ao Supabase para autenticação, armazenamento de dados e arquivos.

---

## Índice

* [Descrição do Projeto](#descrição-do-projeto)
* [Documentação do TCC](#documentação-do-tcc)
* [Demonstração](#demonstração)
* [Funcionalidades](#funcionalidades)
* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Arquitetura do Sistema](#arquitetura-do-sistema)
* [Estrutura de Diretórios](#estrutura-de-diretórios)
* [Pré-requisitos](#pré-requisitos)
* [Variáveis de Ambiente](#variáveis-de-ambiente)
* [Instalação](#instalação)
* [Execução em Desenvolvimento](#execução-em-desenvolvimento)
* [Scripts Disponíveis](#scripts-disponíveis)
* [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
* [Configuração do Supabase](#configuração-do-supabase)
* [Fluxo da Aplicação](#fluxo-da-aplicação)
* [Endpoints da API](#endpoints-da-api)
* [Autenticação e Autorização](#autenticação-e-autorização)
* [Como Contribuir](#como-contribuir)
* [Licença](#licença)
* [Autores](#autores)

---

## Descrição do Projeto

A Tropa Livresca é um projeto voltado para organizar e facilitar a publicação e a descoberta de obras, autores e conteúdos relacionados à editora fictícia Tropa Livresca. O sistema foi pensado como uma solução web completa, com:

* Uma interface pública para navegação e consulta de obras e autores cadastrados.
* Uma área privada para cadastro, gerenciamento e autopublicação de livros.
* Fluxo de autenticação isolado para leitores/autores (Clients) e equipe de moderação (ADM).
* Integração nativa com Supabase para persistência relacional e armazenamento de mídias (Storage).
* Canal direto de suporte e contato integrado a disparos automáticos de e-mail.

---

## Documentação do TCC

Os documentos acadêmicos e monografia associados a este trabalho de conclusão de curso estão hospedados externamente:

* [Monografia / Artigo Técnico do TCC](https://docs.google.com/document/d/1GMXUJkjwNT6-E9qy1RS-Enduoet8U-gaKaqAYvay7hc/edit?usp=sharing)
* [Pasta Compartilhada de Anexos e Entrega Acadêmica](https://google.com)//Em breve
* [Slides da Apresentação da Banca](https://google.com)//Em breve

---

## Demonstração

Em breve será disponibilizada uma demonstração visual do projeto.

* Imagens e GIFs promocionais: Preencher posteriormente.
* Endereço do ambiente de produção: Preencher posteriormente.

---

## Funcionalidades

A plataforma oferece um conjunto de recursos voltados à experiência do leitor, do autor e da gestão editorial.

Para detalhes completos, consulte a documentação específica em [docs/funcionalidades](docs/funcionalidades).

---

## Tecnologias Utilizadas

### Frontend
* React
* Vite
* React Router DOM v6 (Roteamento Aninhado)
* CSS Modules

### Backend
* Node.js
* Express
* CORS
* Cookie Parser
* Multer (Processamento Multipart)
* Nodemailer

### Infraestrutura, Testes e Dados
* Supabase (PostgreSQL / Storage / Auth)
* Módulo nativo `node:test` + `node:assert`
* `supertest` (Simulação HTTP de contratos)
* dotenv

---

## Arquitetura do Sistema

A aplicação segue um modelo estruturado em camadas (Routes, Controllers, Middlewares, Services e Models), com o frontend consumindo a API REST de maneira blindada por cookies locais, gerenciando de forma assíncrona a persistência e a renovação automática de tokens.

Para detalhes técnicos, consulte [docs/arquitetura.md](docs/arquitetura.md).

---

## Diagrama de Casos de Uso

O diagrama completo de casos de uso está disponível em [docs/diagramas/caso-de-uso.puml](docs/diagramas/caso-de-uso.puml).

---

## Estrutura de Diretórios

```text
.
├── backend/
│   ├── src /
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   ├── clients/
│   │   │   └── common/
│   │   │       ├── config/
│   │   │       ├── database/
│   │   │       ├── middlewares/
│   │   │       └── models/
│   │   └── api.js
│   ├── README.md
│   └── .env.example
├── docs/
│   ├── api/
│   │   ├── admin/
│   │   └── clients/
│   ├── diagramas/
│   ├── funcionalidades/
│   ├── arquitetura.md
│   ├── autenticacao.md
│   ├── deploy.md
│   └── instalacao.md
├── frontend/
│   ├── public
│   ├── src/
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   └── features/
│   │   ├── clients/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   └── hooks/
│   │   ├── common/
│   │   │   ├── components/
│   │   │   ├── images/
│   │   │   ├── hooks/
│   │   │   ├── context/
│   │   │   ├── lib/
│   │   │   ├── service/
│   │   │   └── routes/  
│   │   ├── README.md
│   │   └── .env.example
│   ├── App.jsx
│   └── main.jsx
├── .env.example 
├── LICENSE
├── CONTRIBUTING
└── README.md
```

---

## Pré-requisitos

As instruções completas de instalação, ferramentas locais exigidas e configuração de dependências estão descritas em [docs/instalacao.md](docs/instalacao.md).

---

## Variáveis de Ambiente

As propriedades de credenciais e chaves necessárias para a execução segura do projeto estão listadas em [docs/instalacao.md](docs/instalacao.md).

---

## Instalação

Consulte [docs/instalacao.md](docs/instalacao.md) para acessar o passo a passo completo dos comandos de terminal.

---

## Execução em Desenvolvimento

Consulte [docs/instalacao.md](docs/instalacao.md) para obter instruções detalhadas sobre a execução local em paralelo do servidor e do cliente web.

---

## Scripts Disponíveis

A listagem de comandos operacionais (`npm run`) para desenvolvimento, compilação de produção e testes automatizados está documentada em [docs/instalacao.md](docs/instalacao.md).

---

## Configuração do Banco de Dados

A estrutura física das tabelas e os schemas relacionais do banco de dados estão detalhados em [docs/banco-de-dados.md](docs/banco-de-dados.md).

---

## Configuração do Supabase

As parametrizações específicas da console e políticas RLS da infraestrutura estão descritas em [docs/banco-de-dados.md](docs/banco-de-dados.md).

---

## Fluxo da Aplicação

As diretrizes de transição de telas, controle de estados e ciclos de refresh token estão documentados em [docs/autenticacao.md](docs/autenticacao.md).

---

## Endpoints da API

Os contratos de payloads e respostas HTTP estão divididos por escopos em [docs/api/admin](docs/api/admin) e [docs/api/clients](docs/api/clients).

---

## Autenticação e Autorização

A autenticação é realizada de maneira isolada por meio de sessão e cookies HttpOnly no backend, protegendo endpoints e componentes sensíveis como a área de autopublicação e o painel de moderação administrativa.

Para mais detalhes sobre as camadas de segurança, consulte [docs/autenticacao.md](docs/autenticacao.md).

---

## Como Contribuir

Contribuições para correção de bugs ou desenvolvimento de novas features são bem-vem-vindas. Para colaborar de forma padronizada, consulte o guia em [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Licença

Este projeto está licensed sob os termos da GNU General Public License v3.0. Consulte o arquivo [LICENSE](LICENSE) para obter mais detalhes de distribuição legal.

---

## Autores

* David Gabriel Cardoso Pereira: Escopo de documentação e análise.
* Gabriel Rodrigues Duarte: Desenvolvimento fullstack e infraestrutura.
* Luís Fabiano da Silva: Desenvolvimento frontend e design de interface.
* Lukas Soldera Markues: Escopo de documentação e validação.
* Matheus Ruy de Almeida: Desenvolvimento backend e testes de integração.

* Trabalho Acadêmico: Projeto idealizado e desenvolvido como Trabalho de Conclusão de Curso (TCC) para a Tropa Livresca.
