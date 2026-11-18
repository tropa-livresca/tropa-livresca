import { PerfilModel } from "../../common/models/perfil.model.js";
import {
  STORAGE_BUCKET,
  criarUrlAssinada,
  normalizarCaminhoPersistido,
  removerArquivos,
  uploadArquivo,
  validarArquivoArmazenado,
  validarMetadadosUpload,
} from "../../common/config/storage.js";

export class PerfilService {
  static async _formatarPerfil(perfil) {
    if (!perfil?.imagem) return perfil;
    const path = normalizarCaminhoPersistido(
      perfil.imagem,
      STORAGE_BUCKET.PERFIS,
    );
    if (!path) return perfil;
    return {
      ...perfil,
      imagem: await criarUrlAssinada(STORAGE_BUCKET.PERFIS, path),
    };
  }

  static async buscarPerfil(userId) {
    if (!userId) {
      const erro401 = new Error("Usuário não autenticado.");
      erro401.statusCode = 401;
      throw erro401;
    }

    const perfil = await PerfilModel.buscarPerfil(userId);

    if (!perfil) {
      return {
        id: userId,
        nome: "",
        telefone: "",
        descricao: "",
        imagem: "",
        redes_sociais: { instagram: "", facebook: "", linkedin: "", email: "" },
      };
    }

    return this._formatarPerfil(perfil);
  }

  static async atualizarPerfil({ userId, dadosPerfil, redes_sociais }) {
    if (!userId) {
      const erro401 = new Error("Sessão expirada.");
      erro401.statusCode = 401;
      throw erro401;
    }

    try {
      const { nome, telefone, descricao } = dadosPerfil || {};
      const updates = {
        nome: nome || null,
        telefone: telefone || null,
        descricao: descricao || null,
      };

      if (redes_sociais) {
        updates.redes_sociais =
          typeof redes_sociais === "string"
            ? JSON.parse(redes_sociais)
            : redes_sociais;
      }

      return this._formatarPerfil(
        await PerfilModel.atualizarPerfil(userId, updates),
      );
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error("Erro ao atualizar os dados do perfil.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }

  static async AtualizarImagemPerfil({ userId, file }) {
    if (!userId) {
      const erro401 = new Error("Sessão expirada.");
      erro401.statusCode = 401;
      throw erro401;
    }

    if (!file || !file.buffer || !file.originalname) {
      const erroArquivo = new Error(
        "Arquivo de mídia corrompido ou inválido no servidor.",
      );
      erroArquivo.statusCode = 400;
      throw erroArquivo;
    }

    try {
      const perfilAtual = await PerfilModel.buscarPerfil(userId);
      const urlImagemAntiga = perfilAtual?.imagem;

      const extensao = file.originalname.split(".").pop();
      const { regra, extensao: extensaoValida } = validarMetadadosUpload({
        tipo: "imagem_perfil",
        extensao,
        mimeType: file.mimetype,
        tamanho: file.size ?? file.buffer.length,
      });
      const filePath = `${userId}/perfil_${Date.now()}.${extensaoValida}`;
      await uploadArquivo(regra.bucket, filePath, file);
      try {
        await validarArquivoArmazenado(regra.bucket, filePath, "imagem_perfil");
        const perfilData = await PerfilModel.atualizarApenasImagem(
          userId,
          filePath,
        );
        const pathAntigo = normalizarCaminhoPersistido(
          urlImagemAntiga,
          STORAGE_BUCKET.PERFIS,
        );
        if (pathAntigo && pathAntigo !== filePath) {
          await removerArquivos(STORAGE_BUCKET.PERFIS, [pathAntigo]);
        }
        return this._formatarPerfil(perfilData);
      } catch (error) {
        await removerArquivos(regra.bucket, [filePath]);
        throw error;
      }
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error("Erro ao salvar a nova imagem de perfil.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }

  static async RemoverImagemPerfil(userId) {
    if (!userId) {
      const erro401 = new Error("Sessão expirada.");
      erro401.statusCode = 401;
      throw erro401;
    }

    try {
      const perfilAtual = await PerfilModel.buscarPerfil(userId);
      const urlImagemAntiga = perfilAtual?.imagem;

      const perfilData = await PerfilModel.atualizarApenasImagem(userId, null);
      const pathAntigo = normalizarCaminhoPersistido(
        urlImagemAntiga,
        STORAGE_BUCKET.PERFIS,
      );
      if (pathAntigo) {
        await removerArquivos(STORAGE_BUCKET.PERFIS, [pathAntigo]);
      }
      return perfilData;
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error("Erro ao remover a foto de perfil.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }
}
