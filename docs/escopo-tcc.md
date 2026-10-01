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

## Progresso (01/10/2026)

O fluxo central está **funcionando de ponta a ponta** no banco real:

```
Loja → carrinho → checkout → pagamento simulado → Meus Pedidos
  → admin autoriza repasse (30%) → Financeiro (admin) e Meus Ganhos (autor)
  → admin marca enviado → entregue
```

| Área | Situação | Onde |
|---|---|---|
| Backend sobe | ✅ Imports de `notificacoes`/`cartoes` removidos | — |
| Rotas e banco da loja | ✅ Ordem das rotas, nomes de coluna (`data`, `fk_vendas_id`, `fisico`), colunas obrigatórias, sem `transacao_id` | `loja.route.js`, `loja.model.js` |
| Checkout | ✅ Preço e frete calculados no servidor; endereço do próprio usuário; pagamento simulado | `/checkout`, `/pedido/:id` |
| Meus Pedidos | ✅ | `/pedidos` (menu do perfil) |
| E-book por e-mail | ⚠️ Código corrigido, **falta confirmar se o e-mail chega** | `enviarEbookAposPagamento` |
| Repasse 30% | ✅ Controller, 30%, `data`/`status`, só venda paga, sem duplicar, cliente admin do Supabase | `movimentacoes.model.js` |
| Pedidos e Entregas (admin) | ✅ Autorizar repasse (master), marcar enviado/entregue | `/admin/ecommerce/pedidos` |
| Financeiro (admin) | ✅ Total vendido, repassado, saldo e extrato (master) | `/admin/analises/financeiro` |
| Meus Ganhos (autor) | ✅ Saldo e extrato | `/meus-ganhos` (menu do perfil) |
| Avaliações | ✅ Média real, 1–5 estrelas, só quem comprou, uma por usuário | página do produto, aba "Avaliações" |
| Inativar livro | ✅ "Tirar da loja" / "Colocar de volta" | detalhes do livro no admin |
| Menu do admin | ✅ Sem links mortos; Usuários e Financeiro só para master | — |
| Páginas 404 e 403 | ✅ Com o logo e o visual do site | — |
| Testes do backend | ✅ 90 passando | `npm test` em `backend` |

### Pendências antes da banca

| Pendência | Quem |
|---|---|
| Conferir se o **e-mail do e-book** chega (caixa de entrada e spam) | grupo |
| Decidir entre **`/pagamento`** (só visual) e **`/checkout`** (funciona) | grupo |
| **Frete** na página do produto e no carrinho (`calcularFrete` em `Carrinho.jsx`) | colega que está nele |
| **Limpar dados de teste**: livros "Yasmin chata", "kjkjjjjj", "g", capa de foto de caderno, descrição de autor de teste, vendas/repasses de teste | grupo |
| **Documentar a senha inicial de admin** (`senha_adm`, definida via `alterar_senha_adm`) | grupo |
| Chave **`SUPABASE_SERVICE_ROLE_KEY`** nova (`sb_secret_...`) no `.env` de todos e no deploy — as chaves antigas foram desativadas | todos |
| **Ensaiar o roteiro de demo** abaixo | grupo |

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

> A média (`GET /clients/avaliacoes/livro/:id`) é pública; avaliar exige login e compra paga.

## Se sobrar tempo

| # | Tarefa |
|---|---|
| ~~07.2~~ | ✅ Entregas feitas em Pedidos e Entregas |
| — | Saque do autor. `solicitarSaque` já existe no model, falta ligar a rota e o botão. |
| ~~#82~~ | ✅ Páginas de erro refeitas — a issue pode ser fechada |
| ~~10.1~~ | ✅ Cliente só vê os próprios pedidos |

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

0. ✅ Remover os `import` quebrados de `notificacoes`/`cartoes`
1. ✅ Corrigir o repasse
2. ✅ Alinhar banco e corrigir rotas da loja
3. ✅ Checkout com frete por região + pagamento simulado + preço do servidor
4. ⚠️ E-mail do e-book: código pronto, falta confirmar a entrega
5. ✅ Resumo e Meus Pedidos
6. ✅ Pedidos e Entregas no admin com "Autorizar repasse"
7. ✅ Financeiro (admin) e Meus Ganhos (autor)
8. ✅ Avaliações
9. ✅ Inativar livro e limpar o menu do admin
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
- [ ] Em E-commerce → Pedidos e Entregas, ver a venda "paga" com o valor do repasse
- [ ] Clicar em "Autorizar repasse" e ver o status mudar
- [ ] Ver que o botão some e o repasse **não** pode ser duplicado
- [ ] Marcar o pedido físico como enviado e depois como entregue
- [ ] Em Desempenho → Financeiro, ver total vendido, 30% repassado e saldo de 70%
- [ ] Ver a lista de usuários, gerenciar uma revisão e tirar um livro da loja
- [ ] Com um funcionário que não é master, abrir `/admin/usuarios` e ver a página 403

**Autor**
- [ ] Entrar como o autor do livro vendido
- [ ] Menu do perfil → "Meus Ganhos": ver o crédito de 30% da venda

## Sugestão de organização no GitHub

- Milestone **"TCC"** com as issues das Prioridades 1–2
- Label **`pos-tcc`** nas issues cortadas (sem fechar, para não perder o planejamento)
- Fechar a #62 como duplicada da #90
- Atualizar a #126 (EPIC 08): a regra correta é **30% autor**, não 70%
