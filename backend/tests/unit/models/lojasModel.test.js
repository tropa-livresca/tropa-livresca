import {
    supabaseAdminMock as mockSupabaseAdmin,
    supabaseMock as mockSupabases,
    builder,
    resetSupabaseMock,
} from "../../mocks/supabase.mock.js";
import {
  perfilAtualizado,
  perfilCompleto,
} from "../../fixtures/perfil.fixture";
import { LojasModel } from "../../../src/api/common/models/lojas.model.js";
import { supabaseAdmin } from "../../../src/api/common/config/supabase";

jest.mock("../../../src/api/common/config/supabase.js", () => {
  const originalMockSupabase =
    require("../../mocks/supabase.mock.js").supabaseMock;
  originalMockSupabase.rpc = (fnName, params) => builder;

  return {
    __esModule: true,
    default: originalMockSupabase,
    supabaseAdmin: require("../../mocks/supabase.mock.js").supabaseAdminMock,
  };
})

describe("LojasModel = Testes Unitários", () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe("buscarComFiltros", () => {
    it("retorna dados enviados pelo supabase", async () => {
      const mockLista = [perfilCompleto];

      jest.spyOn(builder, "range").mockResolvedValueOnce({
        data: mockLista,
        error: null,
        count: 1,
      });

      const resultado = await LojasModel.buscarComFiltros({});

      console.log(resultado);

      expect(resultado).toEqual({ data: mockLista, count: 1 });
    });

  });

});



