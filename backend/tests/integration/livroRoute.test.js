import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

jest.mock("../../../../src/api/common/config/supabase.js", () => {
  const { builder } = require("../../../mocks/supabase.mock.js");
  return {
    supabaseAdmin: {
      from: jest.fn(() => builder),
      storage: {
        from: jest.fn(() => ({
          upload: jest.fn().mockImplementation(() => Promise.resolve({ error: null })),
          getPublicUrl: jest.fn().mockImplementation(() => ({ data: { publicUrl: "https://supabase.co" } })),
        })),
      },
    },
  };
});

jest.mock("../../../../src/api/common/middlewares/auth.middleware.js", () => 
  require("../../../mocks/auth.mock.js").authMiddlewareMock
);

jest.mock("../../../../src/api/common/middlewares/upload.middleware.js", () => 
  require("../../../mocks/upload.mock.js").uploadMiddlewareMock
);

const request = require("supertest");
const router =
  require("../../../../src/api/clients/livro/livros.route.js").default;
const { createApp } = require("../../../helpers/createApp.js");
const {
  builder,
  resetSupabaseMock,
} = require("../../../mocks/supabase.mock.js");
const {
  livroCompletoMock
} = require("../../../fixtures/livros.fixture.js");

const app = createApp(router);

describe("Rotas de Livro - Testes de Integração (E2E)", () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe("GET /", () => {
    it("Deve responder com status 200 e retornar os dados do banco", async () => {
      
      jest.spyOn(builder, "range").mockResolvedValueOnce({
        livroCompletoMock
      });

      const response = await request(app).get("/").expect(200);

      expect(response.body).toEqual(livroCompletoMock);
    });
  });

});
