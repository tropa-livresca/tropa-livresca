import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

import {
  supabaseAdminMock as mockSupabaseAdmin,
  builder,
  resetSupabaseMock,
} from "../../../mocks/supabase.mock.js";
import { test } from "../../../fixtures/default_model.fixture.js";

jest.mock("../../../../src/api/common/config/supabase.js", () => {
  const originalMockSupabase =
    require("../../../mocks/supabase.mock.js").supabaseMock;
  originalMockSupabase.rpc = (fnName, params) => builder;


  return {
    __esModule: true,
    default: originalMockSupabase,
  supabaseAdmin: mockSupabaseAdmin,
  }
});
  

jest.mock("../../../../src/api/common/middlewares/auth.middleware.js", () => 
  require("../../../mocks/auth.mock.js").authMiddlewareMock
);


const request = require("supertest");
const router =
  require("../../../../src/api/clients/enderecos/endereco.route.js").default;
const { createApp } = require("../../../helpers/createApp.js");

const app = createApp(router);

describe("Rotas de endereço - Testes de Integração (E2E)", () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe("GET /", () => {
    it("Deve responder com status 200 e endereços e retornar os dados do banco", async () => {
      
      builder.resolve({data:[test]}, null)

      const response = await request(app).get("/").expect(200);

      
        
      expect(response.body).toEqual({data:[test]});
    });
  });

  describe("GET /principal", () => {
    it("Deve responder com status 200 e endereços e retornar os dados do banco", async () => {
      
      builder.resolve({data:{test}}, null)

      const response = await request(app).get("/principal").expect(200);

      
        
      expect(response.body).toEqual({data:{test}});
    });
  });

  describe("GET /:id", () => {
    it("Deve responder com status 200 e endereços e retornar os dados do banco", async () => {
      
      builder.resolve({data:{test}}, null)

      const response = await request(app).get("/1").expect(200);

      expect(response.body).toEqual({data:{test}});
    });
  });

  describe("POST /", () => {
    it("Deve responder com status 201 e endereços e retornar os dados do banco", async () => {
      
      builder.resolve({data:{test}}, null)

      const response = await request(app).post("/").send({ estado: "123", bairro: "123",rua: "123",numero: "123",CEP: "123",cidade: "123" ,complemento: "123", pais: "123" ,userId: "123"  }).expect(201);

      expect(response.body).toEqual({data:{test}});
    });
  });

  describe("PUT /:id", () => {
    it("Deve responder com status 200 e endereços e retornar os dados do banco", async () => {
      
      builder.resolve({data:{test}}, null)

      const response = await request(app).put("/1").send({ estado: "123", bairro: "123",rua: "123",numero: "123",CEP: "123",cidade: "123" ,complemento: "123", pais: "123" ,userId: "123"  }).expect(200);

      expect(response.body).toEqual({data:{test}});
    });
  });

  describe("PUT /:id/ativo", () => {
    it("Deve responder com status 200 e endereços e retornar os dados do banco", async () => {
      
      builder.resolve({data:{test}}, null)

      const response = await request(app).patch("/1/ativo").expect(200);

      expect(response.body).toEqual({data:{test}});
    });
  });

  describe("PUT /:id/principal", () => {
    it("Deve responder com status 200 e endereços e retornar os dados do banco", async () => {
      
      builder.resolve({data:{test}}, null)

      const response = await request(app).patch("/1/principal").expect(200);

      expect(response.body).toEqual({data:{test}});
    });
  });
  
});
