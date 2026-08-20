import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

import {
  supabaseAdminMock as mockSupabaseAdmin,
  builder,
  resetSupabaseMock,
} from "../../../mocks/supabase.mock.js";
import { livroCompletoMock } from "../../../fixtures/livros.fixture.js";

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
  require("../../../../src/api/clients/livro/livros.route.js").default;
const { createApp } = require("../../../helpers/createApp.js");

const app = createApp(router);

describe("Rotas de Livro - Testes de Integração (E2E)", () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe("GET /", () => {
    it("Deve responder com status 200 e retornar os dados do banco", async () => {
      
      jest.spyOn(builder, "range").mockResolvedValueOnce({
        data:[livroCompletoMock]
      });

      const response = await request(app).get("/").query({page: 1, limit: 12, busca: "1", apenasAtivos: true,}).expect(200);

      
        
      expect(response.body).toEqual({data:[livroCompletoMock], meta: {page: 1, limit: 12, totalItems: 1, totalPages: Math.ceil(1 / 12) } });
    });
  });

  describe("GET /autor/:id", () => {
    it("Deve responder com status 200 e retornar os dados do banco", async () => {
      
      builder.resolve([livroCompletoMock], null)

      const response = await request(app).get("/autor/1")
        
      expect(response.body).toEqual({data:[livroCompletoMock]});
    });
  });

  describe("GET /detalhes/:id", () => {
    it("Deve responder com status 200 e retornar os dados do banco", async () => {
      
      builder.resolve([livroCompletoMock], null)

      const response = await request(app).get("/detalhes/1")
        
      expect(response.body).toEqual({0:livroCompletoMock});
    });
  });
  
});