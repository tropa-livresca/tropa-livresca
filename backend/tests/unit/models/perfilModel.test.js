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
    it("Deve estruturar a query corretamente e retornar o perfil se ele existir", async () => {
      builder.resolve(perfilCompleto, null); // Usando a Fixture

      const resultado = await PerfilModel.buscarPorId("user-integration-123");

      expect(resultado).toEqual(perfilCompleto);
    });
  });

  describe("salvar", () => {
    it("Deve chamar o upsert com as opções de conflito corretas e retornar o perfil salvo", async () => {
      builder.resolve(perfilAtualizado, null); // Usando a Fixture

      const resultado = await PerfilModel.salvar({ id: "user-integration-123", nome: "Carlos Atualizado" });

      expect(resultado).toEqual(perfilAtualizado);
    });
  });
});
