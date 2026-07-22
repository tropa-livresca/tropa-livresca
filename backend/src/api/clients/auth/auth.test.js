import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/api/v1/clients/auth/session", AuthController.setSession);
app.post("/api/v1/clients/auth/refresh", AuthController.refreshSession);
app.post("/api/v1/clients/auth/signup", AuthController.signup);
app.post("/api/v1/clients/auth/signout", AuthController.signout);
app.post("/api/v1/clients/auth/signin", AuthController.signin);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

test("Suíte de Testes do AuthController", async (t) => {
  await t.test("setSession - Deve definir cookies e retornar dados do usuário com sucesso", async () => {
    AuthService.setSession = async () => ({
      user: { id: "user-123", email: "teste@teste.com" },
      session: { access_token: "mock-access-token", refresh_token: "mock-refresh-token" }
    });

    const response = await request(app)
      .post("/api/v1/clients/auth/session")
      .send({ accessToken: "token-1", refreshToken: "token-2" });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.user.id, "user-123");
    assert.strictEqual(response.body.message, "Sessão definida com sucesso e cookies configurados.");
    assert.match(response.headers["set-cookie"][0], /auth-token=mock-access-token/);
    assert.match(response.headers["set-cookie"][1], /refresh-token=mock-refresh-token/);
  });

  await t.test("refreshSession - Deve retornar 401 se refresh token não for fornecido nos cookies", async () => {
    AuthService.refreshSession = async () => {
      const error = new Error("Token de atualização não fornecido.");
      error.statusCode = 401;
      throw error;
    };

    const response = await request(app)
      .post("/api/v1/clients/auth/refresh");

    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.error, "Token de atualização não fornecido.");
  });

  await t.test("refreshSession - Deve renovar cookies com sucesso quando token for válido", async () => {
    AuthService.refreshSession = async () => ({
      session: { access_token: "new-access-token", refresh_token: "new-refresh-token" }
    });

    const response = await request(app)
      .post("/api/v1/clients/auth/refresh")
      .set("Cookie", ["refresh-token=valid-token"]);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.message, "Sessão renovada com sucesso.");
    assert.match(response.headers["set-cookie"][0], /auth-token=new-access-token/);
    assert.match(response.headers["set-cookie"][1], /refresh-token=new-refresh-token/);
  });

  await t.test("signup - Deve retornar 400 se faltarem parâmetros obrigatórios", async () => {
    AuthService.signup = async () => {
      const error = new Error("Todos os campos são obrigatórios para o cadastro.");
      error.statusCode = 400;
      throw error;
    };

    const response = await request(app)
      .post("/api/v1/clients/auth/signup")
      .send({ email: "teste@teste.com" });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.error, "Todos os campos são obrigatórios para o cadastro.");
  });

  await t.test("signup - Deve retornar 201 ao cadastrar usuário com sucesso", async () => {
    AuthService.signup = async () => ({
      user: { id: "user-789", email: "novo@teste.com" }
    });

    const response = await request(app)
      .post("/api/v1/clients/auth/signup")
      .send({ email: "novo@teste.com", password: "123", telefone: "11999999999", nome: "Fulano" });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.user.id, "user-789");
    assert.strictEqual(response.body.message, "Cadastro realizado com sucesso! Verifique sua caixa de entrada para confirmar o e-mail.");
  });

  await t.test("signout - Deve limpar os cookies de sessão com sucesso", async () => {
    AuthService.signout = async () => {};

    const response = await request(app)
      .post("/api/v1/clients/auth/signout");

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.message, "Desconectado com sucesso.");
    assert.match(response.headers["set-cookie"][0], /auth-token=;/);
    assert.match(response.headers["set-cookie"][1], /refresh-token=;/);
  });

  await t.test("signin - Deve definir cookies e retornar dados em login bem-sucedido", async () => {
    AuthService.signin = async () => ({
      user: { id: "user-signin", email: "login@teste.com" },
      session: { access_token: "login-access-token", refresh_token: "login-refresh-token" }
    });

    const response = await request(app)
      .post("/api/v1/clients/auth/signin")
      .send({ email: "login@teste.com", password: "123" });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.user.id, "user-signin");
    assert.strictEqual(response.body.message, "Login realizado com sucesso!");
    assert.match(response.headers["set-cookie"][0], /auth-token=login-access-token/);
    assert.match(response.headers["set-cookie"][1], /refresh-token=login-refresh-token/);
  });
});
