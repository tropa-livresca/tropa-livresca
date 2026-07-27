import {
  supabaseAdminMock as mockSupabaseAdmin,
  builder,
  restSupabaseMock,
  resetSupabaseMock,
} from "../../mocks/supabase.mock.js";
import {
  perfilAtualizado,
  perfilCompleto,
} from "../../fixtures/perfil.fixture";
import { AutorModel } from "../../../src/api/common/models/autor.model.js";
import { supabaseAdmin } from "../../../src/api/common/config/supabase";

jest.mock("../../../src/api/common/config/supabase.js", () => ({
  supabaseAdmin: mockSupabaseAdmin,
}));

describe("AutorModel = Testes Unitários", () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe("buscarComFiltros", () => {
    it("Deve paginar, filtrar por autores e retornar a lista com o count", async () => {
      const mockLista = [perfilCompleto];

      jest.spyOn(builder, "range").mockResolvedValueOnce({
        data: mockLista,
        error: null,
        count: 1,
      });

      const resultado = await AutorModel.buscarComFiltros({});

      expect(resultado).toEqual({ data: mockLista, count: 1 });
    });

    it("Deve lançar o erro 500 se a busca com filtros falhar no banco", async () => {
      expect.assertions(2);
      const erroBancoMock = { message: "Falha ao buscar autores paginados" };
      builder.resolve(null, erroBancoMock);

      try {
        await AutorModel.buscarComFiltros({ page: 1, limit: 12 });
      } catch (error) {
        expect(error.statusCode).toBe(500);
        expect(error.message).toBe("Falha ao buscar autores paginados");
      }
    });
  });

  describe("buscarPorId", ()=> {
    it("Deve retornar os detalhes do autor em formato de objeto único através do maybeSingle", async() => {
        builder.resolve(perfilCompleto, null);

        const resultado = await AutorModel.buscarPorId("user-integration-123");

        expect(resultado).toEqual(perfilCompleto);
    });

    it("Deve lançar o erro 500 se a buscar detalhada por ID falhar no banco", async() => {
        expect.assertions(2);
        const erroBancoMock = {
            message: "Erro ao carregar autores"
        };
        builder.resolve(null, erroBancoMock);

        try{
            await AutorModel.buscarPorId("user-integration-123");
        }catch(error){
            expect(error.statusCode).toBe(500);
            expect(error.message).toBe("Erro ao carregar autores");
        }
    })
  });
});
