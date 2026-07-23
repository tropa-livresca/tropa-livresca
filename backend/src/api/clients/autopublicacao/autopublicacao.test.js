import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import express from "express";
import { AutopublicacaoController } from "./autopublicacao.controller.js";
import { AutopublicacaoService } from "./autopublicacao.service.js";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = { id: "user-uuid-123" };
  next();
});

app.get(
  "/api/v1/clients/autopublicacao",
  AutopublicacaoController.GetLivrosById,
);
app.post(
  "/api/v1/clients/autopublicacao/upload-url",
  AutopublicacaoController.CriarUploadLivro,
);
app.post(
  "/api/v1/clients/autopublicacao/insertLivro",
  AutopublicacaoController.InsertLivro,
);
app.patch(
  "/api/v1/clients/autopublicacao/updateEstado/:id",
  AutopublicacaoController.UpdateEstado,
);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

test("Suíte de Testes do AutopublicacaoController", async (t) => {
  await t.test(
    "GetLivrosById - Deve retornar a lista de livros com capas do usuário",
    async () => {
      const listaMock = [
        { id: "livro-1", titulo: "Livro Teste 1", capaUrl: "http://link.com" },
      ];
      AutopublicacaoService.getLivrosByIdService = async (userId) => {
        assert.strictEqual(userId, "user-uuid-123");
        return listaMock;
      };

      const response = await request(app).get("/api/v1/clients/autopublicacao");

      assert.strictEqual(response.status, 200);
      assert.deepStrictEqual(response.body, listaMock);
    },
  );

  await t.test(
    "CriarUploadLivro - Deve gerar uma URL de upload com sucesso",
    async () => {
      const payload = { tipo: "manuscrito", extensao: "pdf" };
      const resultadoMock = { uploadUrl: "http://supabase.storage" };

      AutopublicacaoService.criarUploadLivroService = async (params) => {
        assert.strictEqual(params.userId, "user-uuid-123");
        assert.strictEqual(params.tipo, payload.tipo);
        assert.strictEqual(params.extensao, payload.extensao);
        return resultadoMock;
      };

      const response = await request(app)
        .post("/api/v1/clients/autopublicacao/upload-url")
        .send(payload);

      assert.strictEqual(response.status, 200);
      assert.deepStrictEqual(response.body, resultadoMock);
    },
  );

  await t.test(
    "InsertLivro - Deve cadastrar um novo livro e retornar os dados salvos",
    async () => {
      const payload = {
        dadosLivro: { titulo: "Novo Livro", paginas: 150 },
        publicar: true,
        capa: "capa-base64-ou-url",
        manuscritoPath: "pasta/manuscrito.pdf",
      };
      const resultadoMock = { id: "novo-livro-123", ...payload.dadosLivro };

      AutopublicacaoService.insertLivroService = async (params) => {
        assert.strictEqual(params.userId, "user-uuid-123");
        return resultadoMock;
      };

      const response = await request(app)
        .post("/api/v1/clients/autopublicacao/insertLivro")
        .send(payload);

      assert.strictEqual(response.status, 201);
      assert.deepStrictEqual(response.body, resultadoMock);
    },
  );

  await t.test("InativarLivro - Deve inativar o livro via PATCH e retornar 200", async () => {
    let idRecebido = null;

    AutopublicacaoService.inativarLivro = async (id) => {
      idRecebido = id;
    };

    const response = await request(app)
      .patch("/api/v1/clients/autopublicacao/ativo/livro-uuid-789")
      .set("Authorization", "Bearer token-ficticio");

    assert.strictEqual(response.status, 200);
    assert.strictEqual(idRecebido, "livro-uuid-789");
    assert.strictEqual(response.text, "");
  });

  await t.test(
    "UpdateEstado - Deve atualizar o estado do livro para rascunho via PATCH e retornar 200",
    async () => {
      let idRecebido = null;
      let rascunhoRecebido = null;

      AutopublicacaoService.updateEstadoService = async (id, rascunho) => {
        idRecebido = id;
        rascunhoRecebido = rascunho;
      };

      const response = await request(app)
        .patch("/api/v1/clients/autopublicacao/updateEstado/livro-uuid-789")
        .send({ rascunho: true });

      assert.strictEqual(response.status, 200);
      assert.strictEqual(idRecebido, "livro-uuid-789");
      assert.strictEqual(rascunhoRecebido, true);
      assert.strictEqual(response.text, "");
    },
  );
});
