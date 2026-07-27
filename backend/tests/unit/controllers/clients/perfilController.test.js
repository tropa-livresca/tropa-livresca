import { PerfilController } from "../../../../src/api/clients/perfil/perfil.controller.js";
import { PerfilService } from "../../../../src/api/clients/perfil/perfil.service.js";

jest.mock("../../../../src/api/clients/perfil/perfil.service.js", () => ({
  PerfilService: {
    getPerfilService: jest.fn(),
    updatePerfilService: jest.fn(),
  },
}));

describe("PerfilController - Testes Unitários", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      user: { id: "user-123" },
      body: {},
      file: null,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  describe("GetPerfil", () => {
    it("Deve retornar status 200 e o perfil correspondente", async () => {
      const mockPerfil = { id: "user-123", nome: "Mário" };
      PerfilService.getPerfilService.mockResolvedValue(mockPerfil);

      await PerfilController.GetPerfil(req, res, next);

      expect(PerfilService.getPerfilService).toHaveBeenCalledWith("user-123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPerfil);
      expect(next).not.toHaveBeenCalled();
    });

    it("Deve repassar o erro para o middleware next caso o service falhe", async () => {
      const erroService = new Error("Erro interno do servidor");
      PerfilService.getPerfilService.mockRejectedValue(erroService);

      await PerfilController.GetPerfil(req, res, next);

      expect(next).toHaveBeenCalledWith(erroService);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("UpdatePerfil", () => {
    it("Deve extrair os parâmetros corretamente, invocar o service e retornar status 200", async () => {
      req.body = {
        nome: "Mário Atualizado",
        telefone: "123456789",
        descricao: "Nova bio",
        redes_sociais: '{"instagram": "@mario"}',
      };
      req.file = { originalname: "avatar.png" };

      const mockPerfilAtualizado = { id: "user-123", ...req.body, imagem: "https://supabase.co" };
      PerfilService.updatePerfilService.mockResolvedValue(mockPerfilAtualizado);

      await PerfilController.UpdatePerfil(req, res, next);

      expect(PerfilService.updatePerfilService).toHaveBeenCalledWith({
        userId: "user-123",
        dadosPerfil: {
          nome: "Mário Atualizado",
          telefone: "123456789",
          descricao: "Nova bio",
        },
        file: req.file,
        redes_sociais: '{"instagram": "@mario"}',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPerfilAtualizado);
      expect(next).not.toHaveBeenCalled();
    });

    it("Deve repassar o erro para o middleware next caso a atualização falhe", async () => {
      const erroUpdate = new Error("Erro ao atualizar");
      PerfilService.updatePerfilService.mockRejectedValue(erroUpdate);

      await PerfilController.UpdatePerfil(req, res, next);

      expect(next).toHaveBeenCalledWith(erroUpdate);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
