import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

jest.mock(
  "../../../../src/api/clients/autopublicacao/autopublicacao.controller.js",
  () => {
    const handler = (name) => (_req, res) => res.json({ handler: name });

    return {
      AutopublicacaoController: {
        buscarComFiltros: handler("buscarComFiltros"),
        buscarLivroById: handler("buscarLivroById"),
        criarUploadLivro: handler("criarUploadLivro"),
        criarLivro: handler("criarLivro"),
        atualizarEstado: handler("atualizarEstado"),
        atualizarLivro: handler("atualizarLivro"),
        deletarLivroRascunho: handler("deletarLivroRascunho"),
      },
    };
  },
);

jest.mock("../../../../src/api/common/middlewares/auth.middleware.js", () => ({
  checkAuth: (_req, _res, next) => next(),
}));

const request = require("supertest");
const router =
  require("../../../../src/api/clients/autopublicacao/autopublicacao.route.js").default;
const { createApp } = require("../../../helpers/createApp.js");
const app = createApp(router);

describe("Rotas de autopublicação", () => {
  it("encaminha GET / para buscarComFiltros", async () => {
    const response = await request(app).get("/").expect(200);

    expect(response.body).toEqual({ handler: "buscarComFiltros" });
  });

  it("encaminha GET /:id para buscarLivroById", async () => {
    const response = await request(app).get("/42").expect(200);

    expect(response.body).toEqual({ handler: "buscarLivroById" });
  });

  it("encaminha POST /upload-url para criarUploadLivro", async () => {
    const response = await request(app)
      .post("/upload-url")
      .send({})
      .expect(200);

    expect(response.body).toEqual({ handler: "criarUploadLivro" });
  });

  it("encaminha POST / para criarLivro", async () => {
    const response = await request(app).post("/").send({}).expect(200);

    expect(response.body).toEqual({ handler: "criarLivro" });
  });

  it("encaminha PATCH /estado/:id para atualizarEstado", async () => {
    const response = await request(app)
      .patch("/estado/42")
      .send({})
      .expect(200);

    expect(response.body).toEqual({ handler: "atualizarEstado" });
  });

  it("encaminha PATCH /:id para atualizarLivro", async () => {
    const response = await request(app).patch("/42").send({}).expect(200);

    expect(response.body).toEqual({ handler: "atualizarLivro" });
  });

  it("encaminha DELETE /:id para deletarLivroRascunho", async () => {
    const response = await request(app).delete("/42").expect(200);

    expect(response.body).toEqual({ handler: "deletarLivroRascunho" });
  });
});
