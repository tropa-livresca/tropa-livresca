import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import express from "express";
import { PerfilController } from "./perfil.controller.js";
import { PerfilService } from "./perfil.service.js";

const MOCK_USER_ID = "user-123";

const app = express();
app.use(express.json());

const fakeAuth = (req, res, next) => {
  req.user = { id: MOCK_USER_ID };
  next();
};

const fakeUpload = (req, res, next) => {
  next();
};

app.get("/api/v1/clients/perfil", fakeAuth, PerfilController.GetPerfil);
app.put("/api/v1/clients/perfil", fakeAuth, fakeUpload, PerfilController.UpdatePerfil);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

test("Suíte de Testes do PerfilController", async (t) => {

  await t.test("GetPerfil - Sucesso", async () => {
    PerfilService.getPerfilService = async (userId) => {
      assert.strictEqual(userId, MOCK_USER_ID);
      return { id: "perfil-1", nome: "Fulano" };
    };

    const response = await request(app)
      .get("/api/v1/clients/perfil");

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.nome, "Fulano");
  });

  await t.test("GetPerfil - Erro", async () => {
    PerfilService.getPerfilService = async () => {
      const error = new Error("Erro ao buscar perfil.");
      error.statusCode = 404;
      throw error;
    };

    const response = await request(app)
      .get("/api/v1/clients/perfil");

    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.error, "Erro ao buscar perfil.");
  });

  await t.test("UpdatePerfil - Sucesso", async () => {
    const payload = {
      nome: "Fulano Silva",
      telefone: "11999999999",
      descricao: "Dev",
      redes_sociais: { github: "link" }
    };

    PerfilService.updatePerfilService = async ({ userId, dadosPerfil, file, redes_sociais }) => {
      assert.strictEqual(userId, MOCK_USER_ID);
      assert.strictEqual(dadosPerfil.nome, payload.nome);
      assert.strictEqual(dadosPerfil.telefone, payload.telefone);
      assert.strictEqual(dadosPerfil.descricao, payload.descricao);
      assert.deepStrictEqual(redes_sociais, payload.redes_sociais);
      assert.strictEqual(file, undefined);
      
      return { status: "updated" };
    };

    const response = await request(app)
      .put("/api/v1/clients/perfil")
      .send(payload);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.status, "updated");
  });

  await t.test("UpdatePerfil - Erro", async () => {
    PerfilService.updatePerfilService = async () => {
      const error = new Error("Erro ao atualizar.");
      error.statusCode = 400;
      throw error;
    };

    const response = await request(app)
      .put("/api/v1/clients/perfil")
      .send({});

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.error, "Erro ao atualizar.");
  });
});
