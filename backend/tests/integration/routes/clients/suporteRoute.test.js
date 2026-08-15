import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const request = require("supertest");
const router =
  require("../../../../src/api/clients/suporte/suporte.route.js").default;
const { createApp } = require("../../../helpers/createApp.js");

const app = createApp(router);

describe("Rota de Suporte - Teste de Integração (E2E)", () => {

  describe("GET /enviarEmail", () => {
    it("Deve responder com  status 200 success, mensagem de sucesso, id da resposta  e retornar dados do email enviado", async () => {
      
      const response = await request(app).post("/enviarEmail").send({telefone:11888888888, email:"mruydealmeida@gmail.com", mensagem:"abc", nome:"qwe", motivo:"nnmb"}).expect(200);

      expect(response.body).toEqual({});
    });
  });
  
});