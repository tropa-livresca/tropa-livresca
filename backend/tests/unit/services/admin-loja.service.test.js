import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const lojaModelMock = {
  consultarVendas: jest.fn(),
  consultarVenda: jest.fn(),
  autorizarEntrega: jest.fn(),
  alterarStatusEntrega: jest.fn(),
};

jest.mock("../../../src/api/common/models/loja.model.js", () => ({
  LojaModel: lojaModelMock,
}));

const { LojaService } = require("../../../src/api/admin/loja/loja.service.js");

describe("LojaService (admin)", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("lista vendas indicando se o repasse já foi feito", async () => {
    lojaModelMock.consultarVendas.mockResolvedValue({
      data: [
        { id: 1, total: 50, movimentacoes_financeiras: [{ id: 9 }] },
        { id: 2, total: 30, movimentacoes_financeiras: [] },
      ],
      count: 13,
    });

    const resultado = await LojaService.consultarVendas({ page: 1, limit: 12 });

    expect(resultado.data).toEqual([
      { id: 1, total: 50, repassado: true },
      { id: 2, total: 30, repassado: false },
    ]);
    expect(resultado.meta).toMatchObject({ totalItems: 13, totalPages: 2 });
  });

  it("envia só venda paga e pendente de envio", async () => {
    lojaModelMock.consultarVenda.mockResolvedValue({
      status_pagamento: "pendente",
      status_entrega: "Pendente",
    });
    await expect(LojaService.autorizarEntrega(1)).rejects.toMatchObject({
      statusCode: 400,
    });

    lojaModelMock.consultarVenda.mockResolvedValue({
      status_pagamento: "pago",
      status_entrega: "Entregue",
    });
    await expect(LojaService.autorizarEntrega(1)).rejects.toMatchObject({
      statusCode: 409,
    });

    lojaModelMock.consultarVenda.mockResolvedValue({
      status_pagamento: "pago",
      status_entrega: "Pendente",
    });
    await LojaService.autorizarEntrega(1);
    expect(lojaModelMock.autorizarEntrega).toHaveBeenCalledWith(1);
  });

  it("só marca como entregue o que está a caminho", async () => {
    lojaModelMock.consultarVenda.mockResolvedValue({
      status_pagamento: "pago",
      status_entrega: "Pendente",
    });
    await expect(LojaService.alterarStatusEntrega(1)).rejects.toMatchObject({
      statusCode: 409,
    });
    expect(lojaModelMock.alterarStatusEntrega).not.toHaveBeenCalled();
  });
});
