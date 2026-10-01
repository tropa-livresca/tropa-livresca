import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// Cada chamada a supabase.from() consome o próximo resultado da fila.
const resultados = [];
const chamadas = [];

function criarQuery(tabela) {
  const chamada = { tabela, insert: null, delete: false, eq: [] };
  chamadas.push(chamada);

  const query = {
    select: jest.fn(() => query),
    eq: jest.fn((coluna, valor) => {
      chamada.eq.push([coluna, valor]);
      return query;
    }),
    insert: jest.fn((linhas) => {
      chamada.insert = linhas;
      return query;
    }),
    delete: jest.fn(() => {
      chamada.delete = true;
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
  default: { from: jest.fn((tabela) => criarQuery(tabela)) },
}));

const { LojaModel } = require("../../../src/api/common/models/loja.model.js");

describe("LojaModel.realizarVenda", () => {
  beforeEach(() => {
    resultados.length = 0;
    chamadas.length = 0;
  });

  it("grava os itens com fk_vendas_id num único insert", async () => {
    resultados.push(
      { data: { id: 5 }, error: null },
      { data: null, error: null },
    );

    const venda = await LojaModel.realizarVenda({ total: 30 }, [
      { fk_livros_itens_id: 1, qtd: 1 },
      { fk_livros_itens_id: 2, qtd: 2 },
    ]);

    expect(venda).toEqual({ id: 5 });

    const insertItens = chamadas.find((c) => c.tabela === "itens_venda");
    expect(insertItens.insert).toEqual([
      { fk_livros_itens_id: 1, qtd: 1, fk_vendas_id: 5 },
      { fk_livros_itens_id: 2, qtd: 2, fk_vendas_id: 5 },
    ]);
  });

  it("desfaz a venda se os itens não forem gravados", async () => {
    resultados.push(
      { data: { id: 5 }, error: null },
      { data: null, error: new Error("falha nos itens") },
      { data: null, error: null },
    );

    await expect(
      LojaModel.realizarVenda({ total: 30 }, [{ fk_livros_itens_id: 1 }]),
    ).rejects.toThrow("falha nos itens");

    const remocao = chamadas.find((c) => c.delete);
    expect(remocao).toMatchObject({ tabela: "vendas", eq: [["id", 5]] });
  });
});

describe("LojaModel.consultarVenda", () => {
  beforeEach(() => {
    resultados.length = 0;
    chamadas.length = 0;
  });

  it("busca os itens pela coluna fk_vendas_id", async () => {
    resultados.push(
      { data: { id: 5, total: 30 }, error: null },
      { data: [{ id: 1 }], error: null },
    );

    const venda = await LojaModel.consultarVenda(5);

    expect(venda).toEqual({ id: 5, total: 30, itensVenda: [{ id: 1 }] });
    const busca = chamadas.find((c) => c.tabela === "itens_venda");
    expect(busca.eq).toEqual([["fk_vendas_id", 5]]);
  });

  it("retorna 404 quando a venda não existe", async () => {
    resultados.push({ data: null, error: null });

    await expect(LojaModel.consultarVenda(999)).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
