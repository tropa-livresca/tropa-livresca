import {
  supabaseAdminMock as mockSupabaseAdmin,
  builder,
  resetSupabaseMock,
} from "../../mocks/supabase.mock.js";
import { perfilCompleto, perfilAtualizado } from "../../fixtures/perfil.fixture.js";
import { PerfilModel } from "../../../src/api/common/models/perfil.model.js";

jest.mock("../../../src/api/common/config/supabase.js", () => ({
  supabaseAdmin: mockSupabaseAdmin,
}));

describe("PerfilModel - Testes Unitários", () => {
  beforeEach(() => { resetSupabaseMock(); });

  describe("buscarPorId", () => {
    it("retorna dados recebidos do supabase", async () => {
      builder.resolve(perfilCompleto, null);
      
      const resultado = await PerfilModel.buscarPerfil("123");

      expect(resultado).toEqual(perfilCompleto);
    });
  });

  describe("atualizarPerfil", () => {
    it("retorna dados recebidos do supabase", async () => {
      builder.resolve(perfilAtualizado, null); 

      const resultado = await PerfilModel.atualizarPerfil("user-integration-123", "Carlos Atualizado");

      expect(resultado).toEqual(perfilAtualizado);
    });
  });

  describe("atualizarApenasImagem", () => {
    it("retorna dados recebidos do supabase", async () => {
      builder.resolve(perfilAtualizado, null); 

      const resultado = await PerfilModel.atualizarApenasImagem("user-integration-123", "Carlos Atualizado" );

      expect(resultado).toEqual(perfilAtualizado);
    });
  });
});