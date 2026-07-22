import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import express from "express";
import { SuporteController } from "./suporte.controller.js";
import { SuporteService } from "./suporte.service.js";

const app = express();
app.use(express.json());

app.post("/api/v1/clients/suporte", SuporteController.enviarEmail);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

test("Suíte de Testes do SuporteController", async (t) => {

  await t.test("enviarEmail - Sucesso", async () => {
    const dadosEnvio = {
      nome: "Fulano",
      email: "cliente@teste.com",
      assunto: "Erro no Login",
      mensagem: "Não consigo acessar minha conta."
    };

    SuporteService.processarChamado = async (body) => {
      assert.deepStrictEqual(body, dadosEnvio);
      return { messageId: "email-id-123" };
    };

    const response = await request(app)
      .post("/api/v1/clients/suporte")
      .send(dadosEnvio);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.status, "success");
    assert.strictEqual(response.body.message, "Sua mensagem de suporte foi enviada com sucesso!");
    assert.strictEqual(response.body.responseId, "email-id-123");
  });

  await t.test("enviarEmail - Erro", async () => {
    SuporteService.processarChamado = async () => {
      const error = new Error("Serviço de e-mail indisponível.");
      error.statusCode = 503;
      throw error;
    };

    const response = await request(app)
      .post("/api/v1/clients/suporte")
      .send({ mensagem: "Teste" });

    assert.strictEqual(response.status, 503);
    assert.strictEqual(response.body.error, "Serviço de e-mail indisponível.");
  });
});
