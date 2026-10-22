import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const express = require("express");
const request = require("supertest");
const { errorHandler } = require("../../../../src/api/common/middlewares/error.middleware.js");

describe("Middleware global de erros", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("registra e responde erros encaminhados pela rota", async () => {
    const logErro = jest.spyOn(console, "error").mockImplementation(() => {});
    const app = express();

    app.post("/api/v1/admin/revisao", (_req, _res, next) => {
      next(new Error("Falha ao criar revisão."));
    });
    app.use(errorHandler);

    const response = await request(app)
      .post("/api/v1/admin/revisao")
      .expect(500);

    expect(response.body).toEqual({
      status: "error",
      statusCode: 500,
      error: "Falha ao criar revisão.",
    });
    expect(logErro).toHaveBeenCalledWith(
      "Erro detectado no servidor:",
      expect.objectContaining({ message: "Falha ao criar revisão." }),
    );
  });
});
