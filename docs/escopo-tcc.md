# Escopo para entrega do TCC

Este documento reorganiza as issues abertas para que o projeto seja entregue a tempo.
O plano original da Loja (#90, EPICs 01–12) segue o nível de um e-commerce de produção.
Para o TCC, o objetivo é outro: **demonstrar os fluxos principais funcionando de ponta a ponta**
e justificar na monografia o que ficou como trabalho futuro.

> **Foco central:** vendas e **repasse do dinheiro da venda para o autor (30%)**.
> A área administrativa é exigida, mas usuários e revisões já estão prontos.

## Princípios

1. **Caminho feliz primeiro.** O fluxo precisa funcionar na demo. Casos de borda ficam para depois.
2. **Ligar o que já existe.** Boa parte das telas, hooks e rotas já existe. Priorizar integração, não criação.
3. **Simular em vez de integrar.** Pagamento e frete podem ser simulados sem perder valor acadêmico.
4. **Nada quebrado na tela.** É melhor esconder um link do que mostrar uma página vazia ou com erro.
5. **O que for cortado vira "Trabalho futuro" na monografia.** Mostra que o grupo conhece o problema.

## Estado das branches (30/09/2026)

| Branch | O que tem além da `main` local | Impacto no plano |
|---|---|---|
| `origin/main` / `develop` (PR #131) | Removeu os módulos de **cartões** e **notificações** do backend; `itens_venda` ganhou `fisico` e `preco_unitario`; `vendas` trocou `fk_met_pagamentos_id` por `metodo_pagamento` | Parte do EPIC 01 e o corte de cartões/notificações **já foram feitos** |
| `frontend` (luisfabiano77) — **mergeada na `develop` (PR #133)** | Estilo do admin: cabeçalho, navbar lateral, `GerenciarUsuarios`, `GerenciaLivros`, paginação, ajustes na Loja | Estilização de Usuários e da navbar já está na `develop` |

> ⚠️ **A `develop` e a `origin/main` atuais não sobem o backend.** Os arquivos de `notificacoes` e `cartoes` foram
> apagados, mas `backend/src/api/admin/index.js` e `backend/src/api/clients/index.js` ainda os importam
> (`notificacoesRoutes`, `cartoesRoutes`). O erro é `ERR_MODULE_NOT_FOUND`. É preciso remover esses `import`
> e `router.use` antes de tudo.

## Situação atual (levantada no código)

| Área | Situação | O que falta |
|---|---|---|
| Admin — Usuários | ✅ Pronto (listar, ver, inativar, promover, master) | — (estilização mergeada no PR #133) |
| Admin — Revisões | ✅ Pronto (criar, completar, publicar, recall, negar) | — |
| Admin — Livros | ⚠️ Só leitura | Botão de **inativar** livro. Edição completa **não** é necessária |
| Admin — Autorização | ✅ `verificarAutenticacaoAdm` / `AdmMaster` em todas as rotas `/admin` | — |
| **Repasse ao autor** | ⚠️ Código existe, mas **não funciona** (ver abaixo) | Corrigir e criar telas |
| Admin — Vendas | ⚠️ Rotas existem, com bug de ordem (#97) | Página de vendas |
| Loja — Cliente | ⚠️ Telas existem (`Loja`, `ProdutoById`, `Carrinho`, `Compra`, `ResumoCompra`) | Conectar checkout → venda → pedido |
| Frete | ✅ `calcularFretePrazo` em `loja.model.js` calcula por região (1º dígito do CEP) + peso, sem API externa | Só chamar `GET /loja/frete` no checkout |
| E-mail do e-book | ⚠️ `enviarEbookAposPagamento` em `loja.model.js` já monta e envia (nodemailer/SMTP) | Bug: filtra `formato = "digital"`, mas a coluna agora é `fisico` (boolean). Ver 1a |
| Avaliações | ⚠️ Backend pronto (buscar, criar, alterar); hook `useAvaliacoes` existe mas não é usado | `ProdutoById.jsx` mostra ★★★★★ fixo no código |
| Páginas de erro | ✅ `NotFound`, `NaoAutorizado` | Revisar e fechar a #82 |

### Problemas encontrados no repasse (`movimentacoes`)

| Problema | Onde | Efeito |
|---|---|---|
| Controller chama **a si mesmo** em vez do service | `admin/movimentacoes/movimentacoes.controller.js` → `autorizarDepositoContaAutor` | Recursão infinita, então o repasse **nunca executa** |
| Percentual do autor está em **70%** | `common/models/movimentacoes.model.js` → `valorTotalItem * 0.7` | Precisa ser **30%** (`0.3`) |
| Os inserts não definem `status` | mesmo método | A consulta de extrato filtra `status = "concluido"`. Se o default do banco não for esse, o repasse **não aparece no saldo** |
| Chamar duas vezes duplica o repasse | mesmo método | Basta verificar se já existem movimentações para a venda antes de inserir |

---

## Prioridade 1 — Venda + repasse ao autor (centro do TCC)

Fluxo da demo: **cliente compra → venda fica paga → admin autoriza o repasse → 30% cai no saldo do autor → autor vê o extrato**.

### 1a. Criar a venda (lado do cliente)

| # | Tarefa | Escopo enxuto |
|---|---|---|
| #92, #93, #94 | Alinhar banco | Já avançou na `origin/main` (DER novo). Falta conferir se o código usa `metodo_pagamento`, `fisico` e `preco_unitario`. |
| #95 | Migração | Só se #92–#94 exigirem mudança de schema. |
| #97 | Ordem das rotas de `loja.route.js` | `/:id` captura `/:usuarioid` e `/:livroid`. Correção rápida. |
| #98 | Status da venda | Necessário para marcar a venda como paga. |
| #105, #106 | Validar carrinho e recalcular preço no servidor | O valor do repasse depende do preço. Não pode vir do front. |
| #111, #112, #113, #116 | Checkout | `useCompra`, página de checkout, endereço, correção do carrinho. |
| #100, #114 | Frete | **Usar o cálculo por região que já existe** (PAC/SEDEX por 1º dígito do CEP + peso). Não reflete o valor real, e não precisa. |
| #117–#120 | Pagamento | **Fundir num único botão "Pagar (simulado)"** que marca a venda como paga. |
| #115 | E-mail do e-book | Trocar `.eq("formato", "digital")` por `.eq("fisico", false)` em `enviarEbookAposPagamento` e chamar a função ao confirmar o pagamento. |
| #122, #123 | Resumo e Meus Pedidos | Resumo da compra + lista simples de pedidos. |

### 1b. Repasse ao autor (EPIC 08, simplificado)

| # | Tarefa | Escopo enxuto |
|---|---|---|
| 08.1 | Corrigir o controller | Chamar `MovimentacoesService.autorizarDepositoContaAutor`. |
| 08.2 | Corrigir a divisão | **30% autor / 70% plataforma.** Definir `status: "concluido"` nos inserts. |
| 08.3 | Evitar repasse duplicado | Checagem simples: se já há movimentações com `fk_vendas_id`, recusar. Sem transação complexa. |
| — | Só repassar venda paga | Verificar o status de pagamento antes de repassar. |

### 1c. Telas

| Tela | Quem vê | Conteúdo |
|---|---|---|
| **Vendas** (admin) | Admin | Lista de vendas: comprador, livro(s), total, status, repassado sim/não. Botão **"Autorizar repasse"**. |
| **Financeiro** (admin) | Admin master | Saldo da plataforma + extrato. A rota `GET /admin/movimentacoes` já existe. |
| **Meus ganhos** (autor) | Autor | Saldo + extrato de repasses. A rota `GET /clients/movimentacoes` já existe. |

## Prioridade 2 — Admin restante (pequeno)

| # | Tarefa | Escopo enxuto |
|---|---|---|
| — | **Inativar livro** | Um botão que muda o estado do livro (some da Loja). Avaliar reaproveitar `estado-recall`. Não deletar. |
| #81 | Painel de livros | Só o que ajuda a demo: botão de inativar, coluna de gênero. **Sem tela de edição.** |
| 07.3 | Navbar admin | Esconder links sem página: cupons, entregas, notificações, contato, relatórios, autores-leitores. |

## Prioridade 2b — Avaliações (sem comentários)

| # | Tarefa | Escopo enxuto |
|---|---|---|
| 09.1 | Média real no produto | Trocar o ★★★★★ fixo de `ProdutoById.jsx` pela média e quantidade reais, usando `useAvaliacoes`. |
| 09.2 | Avaliar livro comprado | Formulário de 1 a 5 estrelas, **só para quem comprou o livro**. Liga a avaliação ao fluxo de vendas. |
| — | Fora do escopo | Texto na avaliação, listagem individual de avaliações, edição. |

> A rota `GET /clients/avaliacoes` exige login (`checkAuth`). Visitante sem login não vê a média.
> Para a demo não importa, mas vale saber.

## Se sobrar tempo

| # | Tarefa |
|---|---|
| 07.2 | Entregas (`pendente → a_caminho → entregue`). O backend já existe. |
| — | Saque do autor. `solicitarSaque` já existe no model, falta ligar a rota e o botão. |
| #82 | Revisar as páginas de erro e fechar a issue |
| 10.1 | Garantir que o usuário só vê os próprios pedidos |

---

## Cortado → "Trabalho futuro"

| # | Item | Motivo / alternativa |
|---|---|---|
| — | Edição completa de livros no admin | Não exigido. O livro é gerido via revisões + inativar |
| #73 | Tela de revisão de livros | Gerenciamento de revisões já existe. Revisar se a issue pode ser fechada |
| #107 | Criação atômica da venda | Inserção simples é suficiente para a demo |
| #109 | Idempotência da venda | Complexidade de produção |
| #108 | Endereço histórico da venda | Detalhe de modelagem invisível na demo |
| #124 | Detalhe do pedido | A lista do #123 já basta |
| #102, #118 | Cartões salvos / integração de cartões | Pagamento é simulado. **Backend de cartões já foi removido na `origin/main`** |
| — | Notificações | **Já removidas do backend na `origin/main`** |
| #99, #101 | Número de vendas / rotas admin extras | Só se alguma tela precisar |
| 09.3 | Comentários | Fica só com avaliações. Comentário traz lista, edição e moderação, e foge do foco em vendas. A Loja não exibe comentários hoje |
| #103 | Rotas de avaliações e comentários | Só corrigir o que a Prioridade 2b precisar |
| EPIC 10.2 / 10.4 | Proteção de cartões e revisão de RLS | Documentar como melhoria de segurança |
| EPIC 11 | OpenAPI e documentação do fluxo | Um diagrama do fluxo venda → repasse na monografia vale mais |
| EPIC 12 | Testes formais | Substituir pelo **roteiro de demo** abaixo |
| — | Cupons, notificações, contato, relatórios (navbar) | Esconder os links |
| #62 | Inserir Loja Virtual | Duplicada pela #90, pode ser fechada |

---

## Ordem de execução sugerida

0. Remover os `import` quebrados de `notificacoes`/`cartoes`, para o backend voltar a subir
1. Corrigir o repasse (controller, 30%, `status`, checagem de duplicidade). É rápido e desbloqueia o centro do TCC
2. Alinhar banco e corrigir rotas da loja (#92–#94, #97, #98)
3. Checkout com frete por região + pagamento simulado + criação da venda com preço do servidor
4. E-mail do e-book após o pagamento (corrigir filtro `fisico`)
5. Resumo e Meus Pedidos
6. Tela de Vendas no admin com "Autorizar repasse"
7. Telas de Financeiro (admin) e Meus ganhos (autor)
8. Avaliações: média real no produto + avaliar livro comprado
9. Inativar livro, limpar a navbar
10. Ensaiar o roteiro de demo e corrigir o que falhar
11. O que sobrar de tempo vai para "Se sobrar tempo"

## Roteiro de demo (substitui o EPIC 12)

**Cliente**
- [ ] Entrar na Loja e abrir um livro
- [ ] Adicionar ao carrinho, recarregar a página e ver o carrinho mantido
- [ ] Ir ao checkout, escolher endereço, ver o frete calculado pela região do CEP
- [ ] Pagar (simulado) e ver o resumo da compra
- [ ] Comprar um livro digital e **receber o e-book por e-mail** (testar com e-mail real dias antes; conferir spam e se o link do `manuscrito` abre para o comprador)
- [ ] Ver o pedido em "Meus Pedidos"
- [ ] Avaliar o livro comprado e ver a média mudar na página do produto

**Admin**
- [ ] Ver a venda na tela de Vendas, com status "paga" e "não repassada"
- [ ] Clicar em "Autorizar repasse" e ver o status mudar
- [ ] Clicar de novo e ver que o repasse **não** é duplicado
- [ ] Ver no Financeiro a entrada bruta e a saída de 30% para o autor
- [ ] Ver a lista de usuários, gerenciar uma revisão e inativar um livro
- [ ] Tentar acessar `/admin` sem permissão e ver a página de não autorizado

**Autor**
- [ ] Entrar como o autor do livro vendido
- [ ] Ver em "Meus ganhos" o crédito de 30% da venda

## Sugestão de organização no GitHub

- Milestone **"TCC"** com as issues das Prioridades 1–2
- Label **`pos-tcc`** nas issues cortadas (sem fechar, para não perder o planejamento)
- Fechar a #62 como duplicada da #90
- Atualizar a #126 (EPIC 08): a regra correta é **30% autor**, não 70%
