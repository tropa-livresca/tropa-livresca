import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

jest.mock("../../../../src/api/clients/loja/loja.controller.js", () => {
  const handler = (name) => (req, res) =>
    res.json({ handler: name, params: req.params });

  return {
    LojaController: {
      buscarLivros: handler("buscarLivros"),
      buscarLivroById: handler("buscarLivroById"),
      calcularFretePrazo: handler("calcularFretePrazo"),
      buscarHistoricoVendasUsuario: handler("buscarHistoricoVendasUsuario"),
      buscarNumeroVendasLivro: handler("buscarNumeroVendasLivro"),
      consultarVenda: handler("consultarVenda"),
      mudarStatusPagamento: handler("mudarStatusPagamento"),
      realizarVenda: handler("realizarVenda"),
    },
  };
});

jest.mock("../../../../src/api/common/middlewares/auth.middleware.js", () => ({
  checkAuth: (_req, _res, next) => next(),
}));

const request = require("supertest");
const router =
  require("../../../../src/api/clients/loja/loja.route.js").default;
const { createApp } = require("../../../helpers/createApp.js");
const app = createApp(router);

describe("Rotas da Loja (cliente)", () => {
  it.each([
    ["/frete", "calcularFretePrazo"],
    ["/historico-vendas", "buscarHistoricoVendasUsuario"],
    ["/numero-vendas/7", "buscarNumeroVendasLivro"],
    ["/venda/7", "consultarVenda"],
  ])("GET %s não é capturado por /:id", async (rota, handler) => {
    const response = await request(app).get(rota).expect(200);

    expect(response.body.handler).toBe(handler);
  });

  it("encaminha GET /:id para buscarLivroById", async () => {
    const response = await request(app).get("/42").expect(200);

    expect(response.body).toEqual({
      handler: "buscarLivroById",
      params: { id: "42" },
    });
  });

  it("encaminha PATCH /status/:id com o id da venda", async () => {
    const response = await request(app).patch("/status/9").expect(200);

    expect(response.body).toEqual({
      handler: "mudarStatusPagamento",
      params: { id: "9" },
    });
  });
});
