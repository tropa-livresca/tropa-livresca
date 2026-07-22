import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import express from "express";
import { LivrosController } from "./livros.controller.js";
import { LivrosService } from "./livros.service.js";

const app = express();
app.use(express.json());

const router = express.Router();
router.get("/", LivrosController.GetLivros);
router.get("/:id", LivrosController.GetLivrosByAutor);

app.use("/api/v1/clients/livros", router);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

test("Suíte de Testes do LivrosController (Caminho Oficial)", async (t) => {

  await t.test("GetLivros - Deve retornar lista de livros com paginação padrão e status 200", async () => {
    LivrosService.getLivrosService = async (params) => {
      assert.strictEqual(params.page, 1);
      assert.strictEqual(params.limit, 12);
      assert.strictEqual(params.busca, "");
      
      return {
        data: [{ id: "livro-1", titulo: "Dom Casmurro" }],
        meta: { page: 1, total: 1 }
      };
    };

    const response = await request(app)
      .get("/api/v1/clients/livros");

    assert.strictEqual(response.status, 200);
    assert.ok(Array.isArray(response.body.data));
    assert.strictEqual(response.body.data[0].titulo, "Dom Casmurro");
  });

  await t.test("GetLivros - Deve converter e repassar os parâmetros de busca da URL", async () => {
    LivrosService.getLivrosService = async (params) => {
      assert.strictEqual(params.page, 3);
      assert.strictEqual(params.limit, 20);
      assert.strictEqual(params.busca, "javascript");
      return { data: [], meta: { page: 3, total: 0 } };
    };

    const response = await request(app)
      .get("/api/v1/clients/livros?page=3&limit=20&busca=javascript");

    assert.strictEqual(response.status, 200);
  });

  await t.test("GetLivros - Deve tratar e repassar falhas do serviço para o middleware global", async () => {
    LivrosService.getLivrosService = async () => {
      const error = new Error("Erro interno do servidor.");
      error.statusCode = 500;
      throw error;
    };

    const response = await request(app)
      .get("/api/v1/clients/livros");

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.body.error, "Erro interno do servidor.");
  });

  await t.test("GetLivrosByAutor - Deve retornar lista de livros usando o parâmetro ':id'", async () => {
    const mockAutorId = "autor-biografia-123";
    
    LivrosService.getLivrosByAutorService = async (id) => {
      assert.strictEqual(id, mockAutorId);
      return [
        { id: "livro-1", titulo: "O Alienista", autorId: mockAutorId }
      ];
    };

    const response = await request(app)
      .get(`/api/v1/clients/livros/${mockAutorId}`);

    assert.strictEqual(response.status, 200);
    assert.ok(Array.isArray(response.body));
    assert.strictEqual(response.body[0].autorId, mockAutorId);
  });

  await t.test("GetLivrosByAutor - Deve responder com erro mapeado quando o autor não existir", async () => {
    LivrosService.getLivrosByAutorService = async () => {
      const error = new Error("Nenhum livro cadastrado para este autor.");
      error.statusCode = 404;
      throw error;
    };

    const response = await request(app)
      .get("/api/v1/clients/livros/id-nao-existente");

    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.error, "Nenhum livro cadastrado para este autor.");
  });
});
