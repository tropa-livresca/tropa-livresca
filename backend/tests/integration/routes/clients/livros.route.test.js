import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

jest.mock("../../../../src/api/clients/livro/livros.controller.js", () => {
  const handler = (name) => (_req, res) => res.json({ handler: name });

  return {
    LivrosController: {
      buscarLivros: handler("buscarLivros"),
      buscarLivroById: handler("buscarLivroById"),
    },
  };
});

const request = require("supertest");
const router =
  require("../../../../src/api/clients/livro/livros.route.js").default;
const { createApp } = require("../../../helpers/createApp.js");
const app = createApp(router);

describe("Rotas de livros", () => {
  it("encaminha GET / para buscarLivros", async () => {
    const response = await request(app).get("/").expect(200);

    expect(response.body).toEqual({ handler: "buscarLivros" });
  });

  it("encaminha GET /:id para buscarLivroById", async () => {
    const response = await request(app).get("/42").expect(200);

    expect(response.body).toEqual({ handler: "buscarLivroById" });
  });
});
