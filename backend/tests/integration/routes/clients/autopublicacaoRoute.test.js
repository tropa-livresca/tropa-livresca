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
    supabaseAdmin: {
      from: jest.fn(() => builder),
      storage: {
        from: jest.fn(() => ({
          createSignedUploadUrl: jest.fn().mockImplementation(() => ({ data: { token: 123 }})),
          createSignedUrl: jest.fn().mockImplementation(() => ({data:"123"})),
        })),
      },
    },
  }
});
  

jest.mock("../../../../src/api/common/middlewares/auth.middleware.js", () => 
  require("../../../mocks/auth.mock.js").authMiddlewareMock
);


const request = require("supertest");
const router =
  require("../../../../src/api/clients/autopublicacao/autopublicacao.route.js").default;
const { createApp } = require("../../../helpers/createApp.js");

const app = createApp(router);

describe("Rotas de autopublicção - Testes de Integração (E2E)", () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe("GET /", () => {
    it("Deve responder com status 200 e retornar os dados do banco", async () => {
      
      jest.spyOn(builder, "range").mockResolvedValueOnce({
        data:[livroCompletoMock]
      });

      const response = await request(app).get("/").expect(200);

      
        
      expect(response.body).toEqual([livroCompletoMock]);
    });
  });

  describe("POST /upload-url", () => {
      it("Deve responder com status 200 e retornar os dados do banco", async () => {
        
        const response = await request(app).post("/upload-url").send({tipo:"capa_frente" ,extensao:"123"}).expect(200);
  
        expect(response.body.bucket).toEqual("capa-livros");
        expect(typeof response.body.path).toEqual('string');
        expect(response.body.token).toEqual(123);
      });
    });

  describe("POST /insertLivro", () => {
      it("Deve responder com status 200 e retornar os dados do banco", async () => {
        builder.resolve(livroCompletoMock, null)
        
        const response = await request(app).post("/insertLivro").send({capa:{frente: "123", verso: "123", orelhas: "123"}, estadoInicial: "rascunho", manuscritoPath: "user-integration-123/", dadosLivro:{livroCompletoMock} }).expect(201);
  
        expect(response.body).toEqual({data: livroCompletoMock}, "123");
      });
    });

    describe("PUT /updateLivro/:id", () => {
      it("Deve responder com status 200 e retornar os dados do banco", async () => {
        builder.resolve(livroCompletoMock, null)
        
        const response = await request(app).put("/updateLivro/1").send({capa:{frente: "123", verso: "123", orelhas: "123"}, manuscritoPath: "user-integration-123/", dadosLivro:{livroCompletoMock} }).expect(200);
  
        expect(response.body).toEqual({data: livroCompletoMock}, "123");
      });
    });


    describe("PATCH /updateEstado/:id", () => {
      it("Deve responder com status 200 e retornar os dados do banco", async () => {

        jest.spyOn(builder, "maybeSingle").mockResolvedValueOnce({
        data:{estado:"rascunho"}, error: null
      });
        
        const response = await request(app).patch("/updateEstado/1").send({novoEstado: "rascunho"}).expect(200);
  
      });
    });


    describe("PATCH /updateEstado/:id", () => {
      it("Deve responder com status 200 e retornar os dados do banco", async () => {

        jest.spyOn(builder, "maybeSingle").mockResolvedValueOnce({
        data:{estado:"rascunho"}, error: null
      });
        
        const response = await request(app).patch("/updateEstado/1").send({novoEstado: "rascunho"}).expect(200);
  
      });
    });

    describe("PATCH /ativo/:id", () => {
      it("Deve responder com status 200 e retornar os dados do banco", async () => {

        jest.spyOn(builder, "maybeSingle").mockResolvedValueOnce({
        data:{estado:"rascunho"}, error: null
      });
        
        const response = await request(app).patch("/ativo/1").expect(200);
  
      });
    });


    describe("DELETE /rascunho/:id", () => {
      it("Deve responder com status 200 e retornar os dados do banco", async () => {

        jest.spyOn(builder, "maybeSingle").mockResolvedValueOnce({
        data:{estado:"rascunho"}, error: null
      });

      builder.resolve(livroCompletoMock, null)
        
        const response = await request(app).delete("/rascunho/:id").expect(200);
  
      });
    });
    
  
});