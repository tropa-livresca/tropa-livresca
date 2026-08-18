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
  require("../../../../src/api/admin/categorias/categorias.route.js").default;
const { createApp } = require("../../../helpers/createApp.js");

const app = createApp(router);

describe("Rotas de Categoria - Testes de Integração (E2E)", () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe("GET /", () => {
    it("Deve responder com status 200 e retornar os dados do banco", async () => {
      
      jest.spyOn(builder, "range").mockResolvedValueOnce({
        data:[test]
      });

      builder.resolve([test], null);
      
            const response = await request(app).get("/").expect(200);

            expect(response.body).toEqual({data:[test], meta: { totalItems: 0, itemCount: 1,   itemsPerPage: 12,    totalPages: 1,   currentPage: 1, }  });
    });
  });


  describe("GET /:id", () => {
    it("Deve responder com status 200 e retornar os dados do banco", async () => {

      builder.resolve([test], null);
      
            const response = await request(app).get("/1").expect(200);

            expect(response.body).toEqual({data:[test]});
    });
  });

  describe("POST /", () => {
    it("Deve responder com status 200 e retornar os dados do banco", async () => {
      
      jest.spyOn(builder, "range").mockResolvedValueOnce({
        data:[test]
      });

      builder.resolve([test], null);
      
            const response = await request(app).post("/").send({ nome:"1", tipo:"2", descricao:"3" }).expect(201);

            expect(response.body).toEqual({data:[test]});
    });
  });

  describe("PUT /:id", () => {
    it("Deve responder com status 200 e retornar os dados do banco", async () => {

      builder.resolve([test], null);
      
            const response = await request(app).put("/1").send({ nome:"1", tipo:"2", descricao:"3" }).expect(200);

            expect(response.body).toEqual({data:[test]});
    });
  });

  describe("PUT /:id", () => {
    it("Deve responder com status 200 e retornar os dados do banco", async () => {

      builder.resolve([test], null);
      
            const response = await request(app).patch("/1/ativo").expect(200);

            expect(response.body).toEqual({data:[test]});
    });
  });
  
});