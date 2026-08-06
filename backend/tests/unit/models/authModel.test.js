import {
    supabaseAdminMock as mockSupabaseAdmin,
    supabaseMock as mockSupabases,
    builder,
    resetSupabaseMock,
} from "../../mocks/supabase.mock.js";
import {funcionarioAtualizado} from "../../fixtures/funcionario.fixture.js";
import {AuthModel} from "../../../src/api/common/models/auth.model.js";

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

describe("Auth Model - Testes Unitários", () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe('signInAdmistrador', () => {
    it('loga o usuario e retorna seus dados', async () => {
      builder.resolve(funcionarioAtualizado, null);
        
      const username = "1";
      
      const response = await  AuthModel.signInAdministrador(username, "123"); 

      console.log(response);

      expect(response).toEqual(funcionarioAtualizado)
      
    })
  })

   describe('conferir adminstrador', () => {
    it('loga o usuario e retorna seus dados', async () => {
      builder.resolve(funcionarioAtualizado, null);
        
      const username = "1";
      
      const response = await  AuthModel.signInAdministrador(username, "123"); 

      console.log(response);

      expect(response).toEqual(funcionarioAtualizado)
      
    })
  })

});