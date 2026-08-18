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
  require("../../../../src/api/clients/autores/autor.route.js").default;
const { createApp } = require("../../../helpers/createApp.js");
const autorMock = require("../../../fixtures/autor.fixture.js");

const app = createApp(router);

describe("Rotas de Autor - Testes de Integração (E2E)", () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe("GET /", () => {
    it("Deve responder com status 200 e retornar os dados do banco", async () => {

      jest.spyOn(builder, "range").mockResolvedValueOnce({
              data:[autorMock], count:1,
            });
            
      
    });
  });

  describe("GET /:id", () => {
    it("Deve responder com status 200 e retornar os dados do banco", async () => {

      builder.resolve([autorMock], null);

      const response = await request(app).get("/1").expect(200);


      console.log(response.body);
      console.log(response.body.data);

      const autor = autorMock.autor

    expect(response.body).toEqual({data:{ 0: {autor}, livros:[autorMock] }, meta:{ "limit": 12,  "page": 1, "totalItems": 1, "totalPages": 1,   }});
    });
  });

});