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
require("../../../../src/api/admin/funcionarios/funcionarios.route.js").default;
const { createApp } = require("../../../helpers/createApp.js");

const app = createApp(router);

describe("Rotas de Funcionarios - Testes de Integração (E2E)", () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe("POST /", () => {
    it("Deve responder com status 201 e retornar os dados do banco", async () => {
      
      builder.resolve({ test }, null);

      const response = await request(app).post("/").send({usuarioComumId: "1", senhaTemporaria: "1" , funcao: "1" }).expect(201);

      
        
      expect(response.body).toEqual({data:{test}, success: true, message: "Usuário promovido com sucesso!"});
    });
  });

  describe("PATCH /funcao", () => {
    it("Deve responder com status 200 e retornar os dados do banco", async () => {
      
      builder.resolve({ test }, null);

      const response = await request(app).patch("/funcao").send({funcionarioId: "1", funcao: "1" }).expect(200);

      
        
      expect(response.body).toEqual({data:{test}, success: true, message: "Cargo de funcionário alterado com sucesso!"});
    });
  });

  describe("DELETE /", () => {
    it("Deve responder com status 200 e retornar os dados do banco", async () => {
      
      builder.resolve({ test }, null);

      const response = await request(app).delete("/").send({funcionarioId: "1"}).expect(200);

      
        
      expect(response.body).toEqual({data:{test}, success: true, message: "Usuário deletado com sucesso!"});
    });
  });
  
});