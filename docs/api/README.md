# Documentação da API

Esta pasta reúne a documentação técnica de todas as rotas expostas pelo backend do projeto Tropa Livresca, divididas estritamente de acordo com o escopo e nível de permissão de cada ator do sistema.

---

## Visão Geral

* Prefixo Base: Todos os endpoints da aplicação são servidos sob o caminho estruturado /api/v1.
* Isolamento de Contexto: As rotas são separadas em diretórios independentes para diferenciar o painel de gerenciamento corporativo das funcionalidades voltadas ao usuário final.
* Segurança por Escopo: Endpoints administrativos contam com validações exclusivas de perfil, enquanto os endpoints de cliente gerenciam o fluxo da vitrine e autopublicação.
* Respostas e Contratos: Os documentos de mapeamento detalham os payloads JSON esperados, códigos de status HTTP e o comportamento dos cookies de sessão.

---

## Estrutura de Pastas da Documentação

O mapeamento das rotas está organizado na seguinte estrutura de arquivos:

### Contexto de Clientes (`/clients`)
Concentra os recursos públicos e privados consumidos pela aplicação do leitor e escritor:
* `clients/autenticacao.md`: Fluxos de cadastro, login, logout e sessão inicial para usuários comuns.
* `clients/livros.md`: Consulta à vitrine paginada, filtros de busca por texto e detalhes de obras.
* `clients/autores.md`: Listagem do catálogo de autores e perfis biográficos integrados.
* `clients/perfil.md`: Atualização de dados cadastrais, redes sociais e upload de foto do perfil.
* `clients/suporte.md`: Envio de chamados e mensagens de ajuda diretamente para o suporte técnico.

### Contexto de Administração (`/admin`)
Concentra os recursos restritos utilizados pela equipe interna para moderação e gestão do sistema:
* `admin/autenticacao.md`: Login administrativo isolado com fluxo de autenticação dedicado e troca forçada de senha.
