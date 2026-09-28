import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

jest.mock("../../../../src/api/admin/livros/livros.controller.js", () => {
  const handler = (name) => (_req, res) => res.json({ handler: name });

  return {
    LivroController: {
      BuscarLivros: handler("BuscarLivros"),
      BuscarLivroByUserId: handler("BuscarLivroByUserId"),
      BuscarLivroById: handler("BuscarLivroById"),
    },
  };
});

const request = require("supertest");
const router =
  require("../../../../src/api/admin/livros/livros.route.js").default;
const { createApp } = require("../../../helpers/createApp.js");
const app = createApp(router);

describe("Rotas administrativas de livros", () => {
  it("encaminha GET / para BuscarLivros", async () => {
    const response = await request(app).get("/").expect(200);

    expect(response.body).toEqual({ handler: "BuscarLivros" });
  });

  it("encaminha GET /user/:id para BuscarLivroByUserId", async () => {
    const response = await request(app).get("/user/42").expect(200);

    expect(response.body).toEqual({ handler: "BuscarLivroByUserId" });
  });

  it("encaminha GET /:id para BuscarLivroById", async () => {
    const response = await request(app).get("/42").expect(200);

    expect(response.body).toEqual({ handler: "BuscarLivroById" });
  });
});
