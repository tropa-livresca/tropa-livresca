import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// Cada chamada a supabase.from() consome o próximo resultado da fila.
const resultados = [];
const inserts = [];

function criarQuery() {
  const query = {
    select: jest.fn(() => query),
    eq: jest.fn(() => query),
    limit: jest.fn(() => query),
    insert: jest.fn((linhas) => {
      inserts.push(linhas);
      return query;
    }),
    maybeSingle: jest.fn(() => Promise.resolve(resultados.shift())),
    then: (onFulfilled, onRejected) =>
      Promise.resolve(resultados.shift()).then(onFulfilled, onRejected),
  };
  return query;
}

jest.mock("../../../src/api/common/config/supabase.js", () => ({
  __esModule: true,
  default: { from: jest.fn(() => criarQuery()) },
}));

const {
  MovimentacoesModel,
} = require("../../../src/api/common/models/movimentacoes.model.js");

describe("MovimentacoesModel.autorizarDepositoContaAutor", () => {
  beforeEach(() => {
    resultados.length = 0;
    inserts.length = 0;
  });

  it("repassa 30% ao autor e grava data e status", async () => {
    resultados.push(
      { data: { id: 1, status_pagamento: "pago" }, error: null },
      { data: [], error: null },
      {
        data: [{ subtotal: 100, livros: { fk_user_profile_id: "autor-1" } }],
        error: null,
      },
      { data: null, error: null },
    );

    await expect(
      MovimentacoesModel.autorizarDepositoContaAutor(1),
    ).resolves.toEqual({ sucesso: true });

    expect(inserts).toHaveLength(1);
    const [entradaBruta, saidaAutor, creditoAutor] = inserts[0];

    expect(entradaBruta).toMatchObject({ tipo: "entrada", valor: 100 });
    expect(saidaAutor).toMatchObject({ tipo: "saida", valor: 30 });
    expect(creditoAutor).toMatchObject({
      tipo: "entrada",
      valor: 30,
      fk_user_profile_id: "autor-1",
    });

    for (const linha of inserts[0]) {
      expect(linha.status).toBe("concluido");
      expect(linha.data).toEqual(expect.any(String));
    }
  });

  it("recusa venda que não está paga", async () => {
    resultados.push({
      data: { id: 1, status_pagamento: "pendente" },
      error: null,
    });

    await expect(
      MovimentacoesModel.autorizarDepositoContaAutor(1),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(inserts).toHaveLength(0);
  });

  it("recusa repasse duplicado", async () => {
    resultados.push(
      { data: { id: 1, status_pagamento: "pago" }, error: null },
      { data: [{ id: 99 }], error: null },
    );

    await expect(
      MovimentacoesModel.autorizarDepositoContaAutor(1),
    ).rejects.toMatchObject({ statusCode: 409 });
    expect(inserts).toHaveLength(0);
  });

  it("propaga erro do insert em vez de responder sucesso", async () => {
    resultados.push(
      { data: { id: 1, status_pagamento: "pago" }, error: null },
      { data: [], error: null },
      {
        data: [{ subtotal: 50, livros: { fk_user_profile_id: "autor-1" } }],
        error: null,
      },
      { data: null, error: new Error("violação de NOT NULL") },
    );

    await expect(
      MovimentacoesModel.autorizarDepositoContaAutor(1),
    ).rejects.toThrow("violação de NOT NULL");
  });
});
