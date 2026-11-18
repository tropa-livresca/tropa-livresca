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
    obterIdPerfil: async (_pb, id) => id,
  }),
);

const { MovimentacoesModel } =
  await import("../../../src/api/common/models/movimentacoes.model.js");

describe("MovimentacoesModel.autorizarDepositoContaAutor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockColecoes.vendas = {
      getOne: jest.fn().mockResolvedValue({
        id: "sale-1",
        status_pagamento: "pago",
      }),
    };
    mockColecoes.movimentacoes_financeiras = {
      getList: jest.fn().mockResolvedValue({ items: [] }),
      create: jest
        .fn()
        .mockImplementation((record) =>
          Promise.resolve({ id: `movement-${record.tipo}-${record.valor}` }),
        ),
      delete: jest.fn(),
    };
    mockColecoes.itens_venda = {
      getFullList: jest.fn().mockResolvedValue([
        {
          subtotal: 100,
          expand: {
            fk_livros_itens_id: { fk_user_profile_id: "author-1" },
          },
        },
      ]),
    };
  });

  it("cria os lançamentos de venda e comissão usando relações do PocketBase", async () => {
    await expect(
      MovimentacoesModel.autorizarDepositoContaAutor("sale-1"),
    ).resolves.toEqual({ sucesso: true });

    const criadas =
      mockColecoes.movimentacoes_financeiras.create.mock.calls.map(
        ([record]) => record,
      );
    expect(criadas).toHaveLength(3);
    expect(criadas[0]).toMatchObject({
      fk_vendas_id: "sale-1",
      fk_user_profile_id: "",
      tipo: "entrada",
      valor: 100,
      status: "concluido",
    });
    expect(criadas[1]).toMatchObject({
      tipo: "saida",
      valor: 30,
    });
    expect(criadas[2]).toMatchObject({
      fk_user_profile_id: "author-1",
      tipo: "entrada",
      valor: 30,
    });
  });

  it("recusa vendas não pagas e repasses duplicados", async () => {
    mockColecoes.vendas.getOne.mockResolvedValueOnce({
      id: "sale-1",
      status_pagamento: "pendente",
    });
    await expect(
      MovimentacoesModel.autorizarDepositoContaAutor("sale-1"),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(
      mockColecoes.movimentacoes_financeiras.create,
    ).not.toHaveBeenCalled();

    mockColecoes.vendas.getOne.mockResolvedValueOnce({
      id: "sale-1",
      status_pagamento: "pago",
    });
    mockColecoes.movimentacoes_financeiras.getList.mockResolvedValueOnce({
      items: [{ id: "existing" }],
    });
    await expect(
      MovimentacoesModel.autorizarDepositoContaAutor("sale-1"),
    ).rejects.toMatchObject({ statusCode: 409 });
    expect(
      mockColecoes.movimentacoes_financeiras.create,
    ).not.toHaveBeenCalled();
  });

  it("remove lançamentos parciais e propaga o erro se a gravação falhar", async () => {
    mockColecoes.movimentacoes_financeiras.create
      .mockResolvedValueOnce({ id: "created-1" })
      .mockRejectedValueOnce(new Error("falha ao gravar"));

    await expect(
      MovimentacoesModel.autorizarDepositoContaAutor("sale-1"),
    ).rejects.toThrow("falha ao gravar");
    expect(mockColecoes.movimentacoes_financeiras.delete).toHaveBeenCalledWith(
      "created-1",
    );
  });
});
