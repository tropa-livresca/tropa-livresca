import { jest } from "@jest/globals";
const mockColecoes = {};
const mockCliente = {
  collection: jest.fn((nome) => mockColecoes[nome]),
  filter: jest.fn((filter) => filter),
};

jest.unstable_mockModule(
  "../../../src/api/common/models/pocketbase.helpers.js",
  () => ({
    criarClienteModel: () => mockCliente,
    marcarErro(error) {
      error.statusCode = error.statusCode || error.status || 500;
      throw error;
    },
    getListPocketBase(colecao, options) {
      return colecao.getList(options.page, options.limit, options);
    },
    mapearExpansao(record, relacao, campo) {
      return { ...record, [campo]: record.expand?.[relacao] || null };
    },
    mapearCampoArquivo: () => ({}),
    obterIdPerfil: async (_pb, id) => id,
  }),
);

const { LojaModel } =
  await import("../../../src/api/common/models/loja.model.js");

describe("LojaModel.realizarVenda", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockColecoes.vendas = {
      create: jest.fn().mockResolvedValue({ id: "sale-1" }),
    };
    mockColecoes.itens_venda = {
      create: jest
        .fn()
        .mockImplementation((item) =>
          Promise.resolve({ id: `item-${item.fk_livros_itens_id}` }),
        ),
      delete: jest.fn(),
    };
  });

  it("cria a venda e associa cada item pelo id do PocketBase", async () => {
    const venda = await LojaModel.realizarVenda(
      { fk_user_profile_id: "profile-1", total: 30 },
      [
        { fk_livros_itens_id: "book-1", qtd: 1 },
        { fk_livros_itens_id: "book-2", qtd: 2 },
      ],
    );

    expect(venda).toEqual({ id: "sale-1" });
    expect(
      mockColecoes.itens_venda.create.mock.calls.map(([item]) => item),
    ).toEqual([
      {
        fk_livros_itens_id: "book-1",
        qtd: 1,
        fk_vendas_id: "sale-1",
      },
      {
        fk_livros_itens_id: "book-2",
        qtd: 2,
        fk_vendas_id: "sale-1",
      },
    ]);
  });

  it("remove venda e itens já criados quando um item falha", async () => {
    mockColecoes.itens_venda.create
      .mockResolvedValueOnce({ id: "item-1" })
      .mockRejectedValueOnce(new Error("falha nos itens"));
    mockColecoes.vendas.delete = jest.fn();

    await expect(
      LojaModel.realizarVenda({ total: 30 }, [
        { fk_livros_itens_id: "book-1" },
        { fk_livros_itens_id: "book-2" },
      ]),
    ).rejects.toThrow("falha nos itens");

    expect(mockColecoes.itens_venda.delete).toHaveBeenCalledWith("item-1");
    expect(mockColecoes.vendas.delete).toHaveBeenCalledWith("sale-1");
  });
});

describe("LojaModel.consultarVenda", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockColecoes.vendas = {
      getOne: jest.fn().mockResolvedValue({ id: "sale-1", total: 30 }),
    };
    mockColecoes.itens_venda = {
      getFullList: jest
        .fn()
        .mockResolvedValue([{ id: "item-1", fk_vendas_id: "sale-1" }]),
    };
  });

  it("busca os itens vinculados pela relação fk_vendas_id", async () => {
    const venda = await LojaModel.consultarVenda("sale-1");

    expect(venda).toEqual({
      id: "sale-1",
      total: 30,
      users_profile: null,
      itensVenda: [{ id: "item-1", fk_vendas_id: "sale-1", livros: null }],
    });
    expect(mockColecoes.itens_venda.getFullList).toHaveBeenCalledWith(
      expect.objectContaining({ filter: "fk_vendas_id = {:id0}" }),
    );
  });

  it("retorna 404 quando a venda não existe", async () => {
    mockColecoes.vendas.getOne.mockRejectedValue({ status: 404 });

    await expect(LojaModel.consultarVenda("missing")).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
