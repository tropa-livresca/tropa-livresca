import {AuthService} from "../../../../src/api/clients/auth/auth.service.js";
import {AuthModel} from "../../../../src/api/common/models/auth.model.js";


jest.mock("../../../../src/api/common/models/auth.model.js", () => ({
    AuthModel: {
        signinComGoogle: jest.fn(),
        enviarEmailDeRecuperação: jest.fn(),
    },
}));

describe("auth service - testes unitarios", () => {

    beforeEach(() => {
    jest.clearAllMocks();
    });

    describe("signinComGoogle", () => {
       it("retorna o resultado dado pelo model", async () => {

       AuthModel.signinComGoogle.mockResolvedValue({data: {
    provider: 'github',
    url: "<PROVIDER_URL_TO_REDIRECT_TO>",
    flowId: "<PKCE_FLOW_ID_OR_NULL>"
  },
  error: null}) 

  const respostaSupabase = {data: {
    provider: 'github',
    url: "<PROVIDER_URL_TO_REDIRECT_TO>",
    flowId: "<PKCE_FLOW_ID_OR_NULL>"
  },
  error: null};

  console.log(respostaSupabase);

  const respostaSigninComGoogle = await AuthService.signinComGoogle();

        expect(respostaSigninComGoogle).toEqual(respostaSupabase)
    })


   })

   describe("esqueci minha senha", () => {
       it("retorna erro caso email não seja fornecido", async () => {

        const erroEmail = new Error("O e-mail é obrigatório.");
         erroEmail.statusCode = 500;

        await  expect(AuthService.esqueciSenha())
          .rejects
          .toMatchObject(erroEmail)
       })
   })
})
