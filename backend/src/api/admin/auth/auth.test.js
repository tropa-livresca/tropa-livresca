import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import express from "express";
import { AuthService } from "./auth.service.js";
import { AuthModel } from "../../common/models/auth.model.js";
import authRoutes from "./auth.route.js";

const app = express();
app.use(express.json());
app.use("/api/v1/admin/auth", authRoutes);

process.env.MINHA_CHAVE_SUPER_SECRETA = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

test("Suíte de Autenticação de Administradores", async (t) => {
  await t.test("Deve retornar 400 se parâmetros estiverem ausentes no login", async () => {
    const response = await request(app)
      .post("/api/v1/admin/auth/signin")
      .send({ username: "" });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.error, "Username e senha são obrigatórios.");
  });

  await t.test("Deve retornar 401 para credenciais inválidas ou usuário não existente", async () => {
    AuthModel.buscarPorUsername = async () => null;

    const response = await request(app)
      .post("/api/v1/admin/auth/signin")
      .send({ username: "inexistente", senha: "123" });

    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.error, "Usuário ou senha incorretos.");
  });

  await t.test("Deve retornar status TROCA_OBRIGATORIA no primeiro acesso", async () => {
    const senhaSimuladaCripto = AuthService._criptografar("SenhaProvisoria123");

    AuthModel.buscarPorUsername = async () => ({
      user_id: "81f08cb3-f925-45d4-a15f-6d042138aa00",
      username: "joaosilva",
      nome_completo: "João Silva",
      senha_criptografada: senhaSimuladaCripto,
      forcar_troca_senha: true,
      funcao: "admin"
    });

    AuthService.autenticar = async () => ({
      status: "Troca_obrigatoria",
      userId: "81f08cb3-f925-45d4-a15f-6d042138aa00"
    });

    const response = await request(app)
      .post("/api/v1/admin/auth/signin")
      .send({ username: "joaosilva", senha: "SenhaProvisoria123" });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.status, "Troca_obrigatoria");
    assert.ok(response.body.userId);
  });

  await t.test("Deve retornar SUCESSO e um Token JWT em logins válidos subsequentes", async () => {
    const senhaSimuladaCripto = AuthService._criptografar("SenhaDefinitiva123");

    AuthModel.buscarPorUsername = async () => ({
      user_id: "81f08cb3-f925-45d4-a15f-6d042138aa00",
      username: "joaosilva",
      nome_completo: "João Silva",
      senha_criptografada: senhaSimuladaCripto,
      forcar_troca_senha: false,
      funcao: "admin"
    });

    AuthService.autenticar = async () => ({
      status: "Sucesso",
      token: "mocked_token",
      usuario: { username: "joaosilva" }
    });

    const response = await request(app)
      .post("/api/v1/admin/auth/signin")
      .send({ username: "joaosilva", senha: "SenhaDefinitiva123" });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.status, "Sucesso");
    assert.ok(response.body.token);
  });

  await t.test("Deve retornar 400 se parâmetros estiverem ausentes na alteration de senha", async () => {
    const response = await request(app)
      .post("/api/v1/admin/auth/alterar-senha")
      .send({ userId: "" });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.error, "Id do usuário e nova são obrigatórias.");
  });

  await t.test("Deve retornar 200 ao alterar senha obrigatória com sucesso", async () => {
    AuthService.trocarSenhaObrigatoria = async () => {};

    const response = await request(app)
      .post("/api/v1/admin/auth/alterar-senha")
      .send({ userId: "81f08cb3-f925-45d4-a15f-6d042138aa00", novaSenha: "NovaSenhaSegura123" });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.status, "Sucesso");
  });
});
