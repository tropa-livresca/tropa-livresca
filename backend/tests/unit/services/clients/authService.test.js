import {AuthService} from "../../../../src/api/clients/auth/auth.service.js";
import { AuthModel } from "../../../../src/api/common/models/auth.model.js";

jest.mock("../../../../src/api/common/models/auth.model.js", () => ({
    AuthModel: {
        
    },
}));

describe("auth service - testes unitarios", () => {
    it("retorna ", () => {
       AuthService.esqueciSenha()  
    })
})