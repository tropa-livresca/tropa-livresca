/*

import { PerfilService } from "../../../../src/api/clients/perfil/perfil.service.js";
import { PerfilModel } from "../../../../src/api/common/models/perfil.model.js";

jest.mock("../../../../src/api/common/models/perfil.model.js", () => ({
  PerfilModel: {
    buscarPorId: jest.fn(),
    salvar: jest.fn(),
  },
}));

function fromSpy() {
  return {
    upload: uploadSpy,
    getPublicUrl: getPublicUrlSpy,
  };
}

fromSpy.mock = jest.fn(); 

const uploadSpy = jest.fn();
const getPublicUrlSpy = jest.fn();

jest.mock("../../../../src/api/common/config/supabase.js", () => {
  return {
    supabaseAdmin: {
      storage: {
        from: jest.fn((...args) => fromSpy(...args)),
      },
    },
  };
});

describe("PerfilService - Testes Unitários", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPerfilService", () => {
    it("Deve lançar erro 401 se o userId não for enviado", async () => {
      await expect(PerfilService.getPerfilService(null))
        .rejects
        .toMatchObject({
          message: "Usuário não autenticado ou token inválido.",
          statusCode: 401,
        });
    });

    it("Deve retornar um perfil padrão (vazio) estruturado se o model retornar null", async () => {
      PerfilModel.buscarPorId.mockResolvedValue(null);

      const resultado = await PerfilService.getPerfilService("user-123");

      expect(PerfilModel.buscarPorId).toHaveBeenCalledWith("user-123");
      expect(resultado).toHaveProperty("nome", "");
      expect(resultado.redes_sociais).toHaveProperty("instagram", "");
      expect(resultado.id).toBe("user-123");
    });

    it("Deve retornar os dados do perfil originais se o model encontrar o registro", async () => {
      const mockPerfilValido = { id: "user-123", nome: "Mário", telefone: "123" };
      PerfilModel.buscarPorId.mockResolvedValue(mockPerfilValido);

      const resultado = await PerfilService.getPerfilService("user-123");

      expect(resultado).toEqual(mockPerfilValido);
    });
  });

  describe("updatePerfilService", () => {
    it("Deve lançar erro 401 se o userId não for enviado no payload", async () => {
      const payload = { dadosPerfil: {}, redes_sociais: {}, file: null };
      
      await expect(PerfilService.updatePerfilService(payload))
        .rejects
        .toMatchObject({
          message: "Sessão expirada. Autentique-se novamente para salvar as alterações.",
          statusCode: 401,
        });
    });

    it("Deve processar as redes sociais se enviadas em string JSON e salvar as alterações", async () => {
      const payload = {
        userId: "user-123",
        dadosPerfil: { nome: "Mário", telefone: "999", descricao: "Bio" },
        redes_sociais: '{"instagram": "@mario"}',
        file: null,
      };

      PerfilModel.salvar.mockResolvedValue({ id: "user-123", ...payload.dadosPerfil, redes_sociais: { instagram: "@mario" } });

      const resultado = await PerfilService.updatePerfilService(payload);

      expect(PerfilModel.salvar).toHaveBeenCalledWith({
        id: "user-123",
        nome: "Mário",
        telefone: "999",
        descricao: "Bio",
        redes_sociais: { instagram: "@mario" },
      });
      expect(resultado.redes_sociais.instagram).toBe("@mario");
    });

    it("Deve fazer upload do arquivo se enviado e injetar a url pública final nos dados de salvamento", async () => {
      const fakeFile = {
        originalname: "foto.png",
        buffer: Buffer.from("image-data"),
        mimetype: "image/png",
      };

      const payload = {
        userId: "user-123",
        dadosPerfil: { nome: "Mário" },
        file: fakeFile,
      };

      uploadSpy.mockResolvedValue({ error: null });
      getPublicUrlSpy.mockReturnValue({ data: { publicUrl: "https://supabase.co" } });

      await PerfilService.updatePerfilService(payload);

      expect(uploadSpy).toHaveBeenCalledWith("images/user-123/perfil.png", fakeFile.buffer, expect.any(Object));
      
      expect(PerfilModel.salvar).toHaveBeenCalledWith(expect.objectContaining({
        imagem: "https://supabase.co",
      }));
    });

    it("Deve lançar erro 500 se o upload do storage falhar", async () => {
      const fakeFile = { originalname: "foto.jpg", buffer: Buffer.from(""), mimetype: "image/jpeg" };
      const payload = { userId: "user-123", dadosPerfil: {}, file: fakeFile };

      uploadSpy.mockResolvedValue({ error: new Error("Falha no storage") });

      await expect(PerfilService.updatePerfilService(payload))
        .rejects
        .toMatchObject({
          statusCode: 500,
        });
    });
  });
});

*/