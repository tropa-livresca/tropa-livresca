# Contribuindo para a Tropa Livresca

Agradecemos pelo seu interesse em colaborar com o desenvolvimento da plataforma Tropa Livresca. Este guia descreve o fluxo padronizado para submissão de melhorias, correções e novas funcionalidades, mantendo a integridade do histórico do repositório.

---

## Tipos de Contribuição

As colaborações aceitas no projeto englobam os seguintes escopos:
* Correções de bugs na interface ou em endpoints da API.
* Implementação de novas funcionalidades acordadas no escopo do TCC.
* Melhorias na documentação técnica, diagramas e comentários.
* Refatorações de código voltadas para legibilidade e desempenho.
* Inclusão de novos cenários na suíte de testes automatizados.

---

## Fluxo de Trabalho Recomendado

O ciclo de vida de uma contribuição segue estritamente o pipeline abaixo:

```mermaid
flowchart TD
    Fork[1. Fork do Repositório] --> Clone[2. Clone Local]
    Clone --> Branch[3. Criação de Branch Descritiva]
    Branch --> Code[4. Desenvolvimento Isolado]
    Code --> Test[5. Execução dos Testes Locais]
    Test --> Commit[6. Commit Padronizado]
    Commit --> Push[7. Push para o Fork]
    Push --> PR[8. Abertura de Pull Request]
    PR --> Review[9. Revisão de Código e Ajustes]
    Review --> Merge[10. Merge na Branch Principal]
```

---

## Padrão de Branches

Utilize nomenclaturas explícitas baseadas em prefixos para segmentar o histórico de ramificações:

* `feature/`: Desenvolvimento de novas funcionalidades (ex: `feature/cadastro-livro`).
* `fix/`: Correções de falhas ou bugs operacionais (ex: `fix/upload-capa`).
* `docs/`: Atualizações e melhorias na documentação (ex: `docs/guia-contribuicao`).
* `refactor/`: Alterações de código estrutural sem impacto no comportamento final (ex: `refactor/auth-controller`).
* `test/`: Escrita ou ajustes na suíte de testes (ex: `test/integracao-livros`).
* `chore/`: Alterações de manutenção geral de pacotes e build (ex: `chore/atualiza-dependencias`).

---

## Padrão de Commits

O repositório adota estritamente a especificação Conventional Commits. As mensagens devem seguir a estrutura descrita abaixo:

```text
tipo(escopo): descrição curta em letras minúsculas
```

Mapeamento de tipos comuns:
* `feat`: Introdução de uma nova funcionalidade no sistema.
* `fix`: Resolução de um bug ou comportamento incorreto.
* `docs`: Modificações exclusivas em arquivos de documentação Markdown.
* `refactor`: Alterações em código que não corrigem bugs nem adicionam recursos.
* `test`: Adição ou correção de blocos de teste utilizando o node:test.
* `chore`: Alterações em ferramentas, arquivos de build ou dependências do package.json.
* `perf`: Mudanças de código focadas puramente em otimização de performance.

Exemplos práticos:
```text
feat(clients): adiciona fluxo de cadastro de livros
fix(perfil): corrige upload de capa no formulário de usuário
docs(api): atualiza guia de contribuição e endpoints de admin
refactor(auth): reorganiza tratamento de cookies HttpOnly no backend
test(livros): adiciona testes de integração com supertest para vitrine
chore(raiz): atualiza dependências e scripts do ecossistema
```

---

## Checklist Antes de Abrir um Pull Request

* [ ] A alteração foi devidamente executada e validada em ambiente local.
* [ ] A suíte de testes (`npm test`) roda com sucesso sem quebras ou regressões.
* [ ] Os arquivos de documentação correspondentes foram atualizados.
* [ ] Arquivos sensíveis de credenciais locais (`.env`) foram totalmente omitidos.
* [ ] O pull request detalha de forma concisa o problema resolvido e a abordagem adotada.

---

## Segurança e Tratamento de Dados

A inclusão de arquivos `.env`, chaves ativas do Supabase, tokens JWT, credenciais de e-mail ou segredos de banco de dados resulta na rejeição imediata do pull request. Certifique-se de que os tokens fictícios permaneçam restritos aos exemplos explicativos da documentação.

---

## Dúvidas e Reporte de Erros

Caso encontre dificuldades técnicas durante a ambientação ou queira sugerir mudanças estruturais, abra uma issue formal no repositório detalhando o cenário ou entre em contato direto com a equipe de mantenedores do projeto.
