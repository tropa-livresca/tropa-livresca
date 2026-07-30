import { FuncionariosController } from "../../../../src/api/admin/funcionarios/funcionarios.controller";
import { FuncionariosService } from "../../../../src/api/admin/funcionarios/funcionarios.service";

jest.mock("../../../../src/api/admin/funcionarios/funcionarios.service.js", ()=>({
    FuncionariosService: {
        promoverAdm: jest.fn(),
    },
}));

describe("FuncionáriosController = Testes Unitários", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {

        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        next = jest.fn();
    });

    describe("PromoverAdm", () => {
        it("Deve retornar status 200 e o username gerado", async() => {
            FuncionariosService.promoverAdm()
        });
    });
});