import {
  supabaseAdminMock as mockSupabaseAdmin,
  builder,
  resetSupabaseMock,
} from "../../mocks/supabase.mock.js";
import { livroCompletoMock } from "../../fixtures/livros.fixture.js";
import { LivroModel } from "../../../src/api/common/models/livro.model.js";

jest.mock("../../../src/api/common/config/supabase.js", () => ({
  __esModule: true,
  supabaseAdmin: mockSupabaseAdmin,
}));

describe("LivroModel - Testes Unitários", () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe("buscarComFiltros", () => {
    it("Deve paginar, filtrar por livros ativos e retornar a lista com o count", async () => {
      const mockLista = [livroCompletoMock];
      
      jest.spyOn(builder, "range").mockResolvedValueOnce({
        data: mockLista,
        error: null,
        count: 1
      });

      const resultado = await LivroModel.buscarComFiltros({
        page: 1,
        limit: 12,
        busca: "Crônicas",
        apenasAtivos: true,
      });

      expect(resultado).toEqual({ data: mockLista, count: 1 });
    });

    it("Deve lançar o erro 500 se a busca com filtros falhar no banco", async () => {
      expect.assertions(2);
      const erroBancoMock = { message: "Falha ao buscar livros paginados" };
      builder.resolve(null, erroBancoMock);

      try {
        await LivroModel.buscarComFiltros({ page: 1, limit: 12 });
      } catch (error) {
        expect(error.statusCode).toBe(500);
        expect(error.message).toBe("Falha ao buscar livros paginados");
      }
    });
  });

  describe("buscarPorPerfilUsuario", () => {
    it("Deve listar todos os livros vinculados ao id do perfil do usuário", async () => {
      const mockListaUsuario = [livroCompletoMock];
      builder.resolve(mockListaUsuario, null);

      const resultado = await LivroModel.buscarPorPerfilUsuario("user-integration-123");

      expect(resultado).toEqual(mockListaUsuario);
    });

    it("Deve lançar o erro 500 se a busca por perfil falhar no banco", async () => {
      expect.assertions(2);
      const erroBancoMock = { message: "Erro na busca por ID de usuário" };
      builder.resolve(null, erroBancoMock);

      try {
        await LivroModel.buscarPorPerfilUsuario("user-integration-123");
      } catch (error) {
        expect(error.statusCode).toBe(500);
        expect(error.message).toBe("Erro na busca por ID de usuário");
      }
    });
  });

  describe("buscarDetalhesPorId", () => {
    it("Deve retornar os detalhes do livro em formato de objeto único através do maybeSingle", async () => {
      builder.resolve(livroCompletoMock, null);

      const resultado = await LivroModel.buscarDetalhesPorId(1);

      expect(resultado).toEqual(livroCompletoMock);
    });

    it("Deve lançar o erro 500 se a busca detalhada por ID falhar no banco", async () => {
      expect.assertions(2);
      const erroBancoMock = { message: "Erro ao carregar detalhes do livro" };
      builder.resolve(null, erroBancoMock);

      try {
        await LivroModel.buscarDetalhesPorId(1);
      } catch (error) {
        expect(error.statusCode).toBe(500);
        expect(error.message).toBe("Erro ao carregar detalhes do livro");
      }
    });
  });
});
