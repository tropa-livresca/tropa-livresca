import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

jest.mock("../../../../src/api/clients/autores/autor.controller.js", () => {
  const handler = (name) => (_req, res) => res.json({ handler: name });

  return {
    AutorController: {
      GetAutores: handler("GetAutores"),
      GetAutorById: handler("GetAutorById"),
    },
  };
});

const request = require("supertest");
const router =
  require("../../../../src/api/clients/autores/autor.route.js").default;
const { createApp } = require("../../../helpers/createApp.js");
const app = createApp(router);

describe("Rotas de autores", () => {
  it("encaminha GET / para GetAutores", async () => {
    const response = await request(app).get("/").expect(200);

    expect(response.body).toEqual({ handler: "GetAutores" });
  });

  it("encaminha GET /:id para GetAutorById", async () => {
    const response = await request(app).get("/42").expect(200);

    expect(response.body).toEqual({ handler: "GetAutorById" });
  });
});
