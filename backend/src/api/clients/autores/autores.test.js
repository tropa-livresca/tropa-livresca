import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import express from "express";
import { AutorController } from "./autor.controller.js";
import { AutorService } from "./autor.service.js";
import autorRoutes from "./autor.route.js";

const app = express();
app.use(express.json());
app.use("/api/v1/clients/autores", autorRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

test("Suíte de Testes do AutorController", async (t) => {
  await t.test("GetAutores - Deve retornar lista de autores paginada e com filtros aplicados", async () => {
    const resultadoMock = {
      data: [{ id: "autor-1", nome: "Machado de Assis" }],
      total: 1,
      page: 1,
      limit: 12
    };

    AutorService.getAutoresService = async (params) => {
      assert.strictEqual(params.page, 2);
      assert.strictEqual(params.limit, 5);
      assert.strictEqual(params.busca, "Machado");
      return resultadoMock;
    };

    const response = await request(app)
      .get("/api/v1/clients/autores?page=2&limit=5&busca=Machado");

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, resultadoMock);
  });

  await t.test("GetAutores - Deve assumir valores padrão de paginação quando queries forem omitidas", async () => {
    const resultadoMock = { data: [], total: 0, page: 1, limit: 12 };

    AutorService.getAutoresService = async (params) => {
      assert.strictEqual(params.page, 1);
      assert.strictEqual(params.limit, 12);
      assert.strictEqual(params.busca, "");
      return resultadoMock;
    };

    const response = await request(app)
      .get("/api/v1/clients/autores");

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, resultadoMock);
  });

  await t.test("GetAutorById - Deve retornar detalhes do autor por ID com seus livros paginados", async () => {
    const resultadoMock = {
      autor: { id: "autor-uuid-999", nome: "Clarice Lispector" },
      livros: [{ id: "livro-1", titulo: "A Hora da Estrela" }],
      page: 1,
      limit: 12
    };

    AutorService.getAutorByIdService = async (params) => {
      assert.strictEqual(params.id, "autor-uuid-999");
      assert.strictEqual(params.page, 1);
      assert.strictEqual(params.limit, 12);
      return resultadoMock;
    };

    const response = await request(app)
      .get("/api/v1/clients/autores/autor-uuid-999");

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, resultadoMock);
  });
});
