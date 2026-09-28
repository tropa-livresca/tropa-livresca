import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

jest.mock("../../../../src/api/admin/revisao/revisao.controller.js", () => {
  const handler = (name) => (_req, res) => res.json({ handler: name });

  return {
    RevisaoController: {
      BuscarRevisoes: handler("BuscarRevisoes"),
      BuscarRevisaoById: handler("BuscarRevisaoById"),
      BuscarRevisaoByUserId: handler("BuscarRevisaoByUserId"),
      VerificarRevisor: handler("VerificarRevisor"),
      CriarRevisao: handler("CriarRevisao"),
      AtualizarRevisao: handler("AtualizarRevisao"),
      BuscarLivroRevisao: handler("BuscarLivroRevisao"),
      InativarRevisao: handler("InativarRevisao"),
      CompletarRevisao: handler("CompletarRevisao"),
      PublicarLivro: handler("PublicarLivro"),
      SolicitarRecallLivro: handler("SolicitarRecallLivro"),
      NegarPublicacaoLivro: handler("NegarPublicacaoLivro"),
    },
  };
});

jest.mock("../../../../src/api/common/middlewares/auth.middleware.js", () => {
  const next = (_req, _res, callback) => callback();

  return {
    verificarAutenticacaoAdm: next,
  };
});

const request = require("supertest");
const router =
  require("../../../../src/api/admin/revisao/revisao.route.js").default;
const { createApp } = require("../../../helpers/createApp.js");
const app = createApp(router);

describe("Rotas administrativas de revisão", () => {
  it("encaminha GET / para BuscarRevisoes", async () => {
    const response = await request(app).get("/").expect(200);

    expect(response.body).toEqual({ handler: "BuscarRevisoes" });
  });

  it("encaminha GET /:id para BuscarRevisaoById", async () => {
    const response = await request(app).get("/42").expect(200);

    expect(response.body).toEqual({ handler: "BuscarRevisaoById" });
  });

  it("encaminha GET /user/:id para BuscarRevisaoByUserId", async () => {
    const response = await request(app).get("/user/42").expect(200);

    expect(response.body).toEqual({ handler: "BuscarRevisaoByUserId" });
  });

  it("encaminha GET /verificarRevisor/:livroId para VerificarRevisor", async () => {
    const response = await request(app).get("/verificarRevisor/42").expect(200);

    expect(response.body).toEqual({ handler: "VerificarRevisor" });
  });

  it("encaminha POST / para CriarRevisao", async () => {
    const response = await request(app).post("/").send({}).expect(200);

    expect(response.body).toEqual({ handler: "CriarRevisao" });
  });

  it("encaminha PUT /:id para AtualizarRevisao", async () => {
    const response = await request(app).put("/42").send({}).expect(200);

    expect(response.body).toEqual({ handler: "AtualizarRevisao" });
  });

  it("encaminha PATCH /:id/ativo para InativarRevisao", async () => {
    const response = await request(app).patch("/42/ativo").expect(200);

    expect(response.body).toEqual({ handler: "InativarRevisao" });
  });

  it("encaminha PATCH /:id/completado para CompletarRevisao", async () => {
    const response = await request(app).patch("/42/completado").expect(200);

    expect(response.body).toEqual({ handler: "CompletarRevisao" });
  });

  it.each([
    ["/estado-publicado", "PublicarLivro"],
    ["/estado-recall", "SolicitarRecallLivro"],
    ["/estado-negado", "NegarPublicacaoLivro"],
  ])("encaminha PATCH %s", async (path, handler) => {
    const response = await request(app).patch(path).send({}).expect(200);

    expect(response.body).toEqual({ handler });
  });
});
