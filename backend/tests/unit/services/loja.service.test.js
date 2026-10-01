import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const lojaModelMock = {
  buscarLivrosParaVenda: jest.fn(),
  calcularFretePrazo: jest.fn(),
  realizarVenda: jest.fn(),
  consultarVenda: jest.fn(),
  mudarStatusPagamento: jest.fn(),
};

const enderecoModelMock = {
  BuscarEnderecoById: jest.fn(),
};

jest.mock("../../../src/api/common/models/loja.model.js", () => ({
  LojaModel: lojaModelMock,
}));
jest.mock("../../../src/api/common/models/endereco.model.js", () => ({
  EnderecoModel: enderecoModelMock,
}));

const { LojaService } = require("../../../src/api/clients/loja/loja.service.js");

const LIVROS = [
  { id: 1, titulo: "Livro A", preco_fisico: 50, preco_digital: 20 },
  { id: 2, titulo: "Livro B", preco_fisico: null, preco_digital: 15 },
];

const ENDERECO = {
  rua: "Rua X",
  num: 10,
  bairro: "Centro",
  cidade: "Bauru",
  estado: "SP",
  cep: "17010-000",
};

describe("LojaService.realizarVenda", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    lojaModelMock.buscarLivrosParaVenda.mockResolvedValue(LIVROS);
    lojaModelMock.realizarVenda.mockResolvedValue({ id: 10 });
    enderecoModelMock.BuscarEnderecoById.mockResolvedValue({ data: ENDERECO });
    lojaModelMock.calcularFretePrazo.mockResolvedValue([
      { modalidade: "PAC", preco: 14.3 },
      { modalidade: "SEDEX", preco: 19.9 },
    ]);
  });

  it("usa o preço do banco e ignora o que vier do navegador", async () => {
    await LojaService.realizarVenda("user-1", {
      itens: [{ livroId: 2, fisico: false, qtd: 1, preco: 0.01 }],
    });

    const [, itensVenda] = lojaModelMock.realizarVenda.mock.calls[0];
    expect(itensVenda).toEqual([
      {
        fk_livros_itens_id: 2,
        fisico: false,
        qtd: 1,
        preco_unitario: 15,
        subtotal: 15,
      },
    ]);
  });

  it("soma o frete mais barato no total quando há livro físico", async () => {
    const venda = await LojaService.realizarVenda("user-1", {
      itens: [
        { livroId: 1, fisico: true, qtd: 2 },
        { livroId: 2, fisico: false, qtd: 1 },
      ],
      enderecoId: 3,
    });

    expect(venda).toEqual({ id: 10, total: 129.3, frete: 14.3 });
    expect(lojaModelMock.calcularFretePrazo).toHaveBeenCalledWith(
      "17010-000",
      [{ tipo: "fisico", quantidade: 2 }],
    );

    const [dadosVenda] = lojaModelMock.realizarVenda.mock.calls[0];
    expect(dadosVenda).toMatchObject({
      fk_user_profile_id: "user-1",
      total: 129.3,
      status_pagamento: "pendente",
      status_entrega: "Pendente",
      endereco_entrega: expect.objectContaining({ cep: "17010-000" }),
    });
    expect(dadosVenda.transacao_id).toEqual(expect.any(String));
    expect(dadosVenda.data).toEqual(expect.any(String));
  });

  it("compra só digital não exige endereço nem cobra frete", async () => {
    const venda = await LojaService.realizarVenda("user-1", {
      itens: [{ livroId: 1, fisico: false, qtd: 5 }],
    });

    expect(venda).toEqual({ id: 10, total: 20, frete: 0 });
    expect(enderecoModelMock.BuscarEnderecoById).not.toHaveBeenCalled();

    const [dadosVenda, itensVenda] = lojaModelMock.realizarVenda.mock.calls[0];
    expect(dadosVenda.status_entrega).toBe("Não se aplica");
    // Digital é sempre uma unidade, mesmo que o navegador mande 5.
    expect(itensVenda[0].qtd).toBe(1);
  });

  it("exige endereço quando há livro físico", async () => {
    await expect(
      LojaService.realizarVenda("user-1", {
        itens: [{ livroId: 1, fisico: true, qtd: 1 }],
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("recusa endereço de outro usuário", async () => {
    enderecoModelMock.BuscarEnderecoById.mockRejectedValue(new Error("0 rows"));

    await expect(
      LojaService.realizarVenda("user-1", {
        itens: [{ livroId: 1, fisico: true, qtd: 1 }],
        enderecoId: 99,
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Endereço de entrega inválido.",
    });
  });

  it("recusa livro indisponível", async () => {
    await expect(
      LojaService.realizarVenda("user-1", {
        itens: [{ livroId: 404, fisico: false, qtd: 1 }],
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("recusa formato sem preço", async () => {
    await expect(
      LojaService.realizarVenda("user-1", {
        itens: [{ livroId: 2, fisico: true, qtd: 1 }],
        enderecoId: 3,
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("recusa carrinho vazio e quantidade inválida", async () => {
    await expect(
      LojaService.realizarVenda("user-1", { itens: [] }),
    ).rejects.toMatchObject({ statusCode: 400 });

    await expect(
      LojaService.realizarVenda("user-1", {
        itens: [{ livroId: 1, fisico: true, qtd: 0 }],
        enderecoId: 3,
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});

describe("LojaService.consultarVenda e mudarStatusPagamento", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("não mostra venda de outro usuário", async () => {
    lojaModelMock.consultarVenda.mockResolvedValue({
      id: 10,
      fk_user_profile_id: "outro",
    });

    await expect(
      LojaService.consultarVenda(10, "user-1"),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("paga a venda e envia o e-book para o e-mail do usuário logado", async () => {
    lojaModelMock.consultarVenda.mockResolvedValue({
      id: 10,
      fk_user_profile_id: "user-1",
      status_pagamento: "pendente",
    });
    lojaModelMock.mudarStatusPagamento.mockResolvedValue({ id: 10 });

    await LojaService.mudarStatusPagamento(10, {
      id: "user-1",
      email: "leitor@teste.com",
    });

    expect(lojaModelMock.mudarStatusPagamento).toHaveBeenCalledWith(
      10,
      "leitor@teste.com",
    );
  });

  it("não paga duas vezes", async () => {
    lojaModelMock.consultarVenda.mockResolvedValue({
      id: 10,
      fk_user_profile_id: "user-1",
      status_pagamento: "pago",
    });

    await expect(
      LojaService.mudarStatusPagamento(10, { id: "user-1", email: "x@y.z" }),
    ).rejects.toMatchObject({ statusCode: 409 });
    expect(lojaModelMock.mudarStatusPagamento).not.toHaveBeenCalled();
  });
});
