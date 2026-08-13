
import {
    supabaseAdminMock as mockSupabaseAdmin,
    supabaseMock as mockSupabases,
    builder,
    resetSupabaseMock,
} from "../../mocks/supabase.mock.js";
import {funcionarioAtualizado} from "../../fixtures/funcionario.fixture.js";
import {funcionarioAutorizado} from "../../fixtures/funcionario.fixture.js";
import {funcionarioConferido} from "../../fixtures/funcionario.fixture.js";
import {funcionarioSenha} from "../../fixtures/funcionario.fixture.js";
import {AuthModel} from "../../../src/api/common/models/auth.model.js";
import {sesao} from "../../fixtures/auth.fixture.js";

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
    it('retorna dados recebidos do supabase', async () => {

      builder.resolve(funcionarioAutorizado, null);
        
      const username = "1";
      
      const response = await  AuthModel.signInAdministrador(username, "123"); 

      console.log(response);

      expect(response).toEqual(funcionarioAutorizado)
      
    })
  })

   describe('conferir adminstrador', () => {
    it('retorna dados recebidos do supabase', async () => {
      builder.resolve(funcionarioConferido, null);
        
      const response = await  AuthModel.conferirAdministrador(funcionarioAtualizado[0].id); 

      console.log(response);

      expect(response).toEqual(funcionarioConferido)
      
    })
  })

  describe('atualizar senha', () => {
    it('retorna dados recebidos do supabase', async () => {
      builder.resolve(funcionarioAutorizado, null);
        
      const response = await  AuthModel.atualizarSenha(funcionarioSenha); 

      console.log(response);

      expect(response).toEqual(funcionarioAutorizado)
      
    })
  })

  describe('atualizar status_ativo', () => {
    it('retorna dados recebidos do supabase', async () => {
      builder.resolve({ "status": 204,  "statusText": ""}, null);
        
      const response = await  AuthModel.atualizarSenha(funcionarioAtualizado[0].id); 

      console.log(response);

      expect(response).toEqual({ "status": 204,  "statusText": ""})
      
    })
  });
    
    describe('emviarEmailRecuperação', () => {
    it('retorna dados recebidos do supabase', async () => {
      builder.resolve({ data: {},  error: null}, null);
        
      const response = await  AuthModel.enviarEmailRecuperacao("123@123, 123.com"); 

      console.log(response);

      expect(response).toEqual({ data: {},  error: null})
      
    })
  })

  describe('signInComGoogle', () => {
    it('retorna dados recebidos do supabase', async () => {
      builder.resolve(funcionarioAtualizado);
        
      const response = await  AuthModel.enviarEmailRecuperacao("123@123"); 

      console.log(response);

      expect(response).toEqual(funcionarioAtualizado)
      
    })
  })

  describe('setSession', () => {
    it('retorna dados recebidos do supabase', async () => {
      builder.resolve(funcionarioAtualizado);
        
      const response = await  AuthModel.enviarEmailRecuperacao("123, 124"); 

      console.log(response);

      expect(response).toEqual(funcionarioAtualizado)
      
    })
  })

   describe('setSessionWithCode', () => {
    it('verifica se recebe sesao do supabase e retorna dados recebidos ', async () => {
      builder.resolve(sesao);
        
      const response = await  AuthModel.setSessionWithCode("123"); 

      console.log(response);

      expect(response).toEqual(sesao)
      
    })
  })

  describe('signup', () => {
    it('verifica se recebe dados do usuario por pros e retorna dados recebidos', async () => {
      builder.resolve(sesao);
        
      const response = await  AuthModel.signup("123@123.com", 123, 124, 555); 

      console.log(response);

      expect(response).toEqual(sesao)
      
    })
  })

   describe('signout', () => {
    it('retorna verdadeira quando não ha erros', async () => {
        
      const response = await  AuthModel.signout();

      expect(response).toEqual(true)
      
    })
  })

  describe('signin', () => {
    it('retorna dados recebidos do supabase', async () => {
      builder.resolve(sesao);
        
      const response = await  AuthModel.signin(); 

      console.log(response);

      expect(response).toEqual(sesao)
      
    })
  })


});