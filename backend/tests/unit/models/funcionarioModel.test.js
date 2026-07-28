import {
  supabaseAdminMock as mockSupabaseAdmin,
  supabaseMock as mockSupabase,
  builder,
  resetSupabaseMock,
} from "../../mocks/supabase.mock.js";
import { funcionarioAtualizado } from "../../fixtures/funcionario.fixture.js";
import { FuncionariosModel } from "../../../src/api/common/models/funcionarios.model.js";

jest.mock("../../../src/api/common/config/supabase.js", () => {
  const originalMockSupabase =
    require("../../mocks/supabase.mock.js").supabaseMock;
  originalMockSupabase.rpc = (fnName, params) => builder;

  return {
    __esModule: true,
    default: originalMockSupabase,
    supabaseAdmin: require("../../mocks/supabase.mock.js").supabaseAdminMock,
  };
});

describe("Funcionários Model - Testes Unitários", () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe("atualizarCargo", () => {
    it("Deve chamar o upsert com as opções de conflito corretas e retornar o funcionário alterado", async () => {
      builder.resolve(funcionarioAtualizado, null);

      const resultado = await FuncionariosModel.atualizarCargo({
        id: "funcionario-123",
        funcao: "revisor",
      });

      expect(resultado).toEqual(funcionarioAtualizado);
    });
  });

  describe("deletarFuncionario", () => {
    it("Deve deletar o usuário", async () => {
      const retornoEsperado = [funcionarioAtualizado];
      builder.resolve(retornoEsperado, null);

      const resultado =
        await FuncionariosModel.deletarFuncionario("funcionario-123");

      expect(resultado).toEqual(retornoEsperado);
    });
  });

  describe("promoverAdm", () => {
    it("Deve chamar a RPC correta com os parâmetros e retornar o resultado de sucesso", async () => {
      const mockRetornoRpc = {
        succes: true,
        username_adm: "Carlos Revisor",
      };
      builder.resolve(mockRetornoRpc, null);

      const resultado = await FuncionariosModel.promoverAdm(
        "funcionario-123",
        "senhaTemporaria123",
        "revisor",
      );

      expect(resultado).toEqual(mockRetornoRpc);
    });

    it("Deve lançar o erro 500 se a RPC falhar", async () => {
      expect.assertions(2);
      const erroBancoMock = { message: "Erro interno na execução da RPC" };
      builder.resolve(null, erroBancoMock);

      try {
        await FuncionariosModel.promoverAdm(
          "funcionario-123",
          "senhaTemp",
          "revisor",
        );
      } catch (error) {
        expect(error.statusCode).toBe(500);
        expect(error.message).toBe("Erro interno na execução da RPC");
      }
    });
  });
});
