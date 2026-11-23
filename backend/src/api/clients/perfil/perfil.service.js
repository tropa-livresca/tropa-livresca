import { PerfilModel } from "../../common/models/perfil.model.js";
import {
  criarClienteModel,
  mapearCampoArquivo,
  primeiraUrlArquivo,
} from "../../common/models/pocketbase.helpers.js";
import { validarMetadadosUpload } from "../../common/config/storage.js";

export class PerfilService {
  static async _formatarPerfil(perfil) {
    if (!perfil) return perfil;

    const pb = criarClienteModel();
    const imagem = mapearCampoArquivo(pb, perfil, "imagem");

    return {
      ...perfil,
      ...imagem,
      imagem: primeiraUrlArquivo(imagem.imagemUrl),
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
      const erroPerfil = new Error("Perfil do usuário não encontrado.");
      erroPerfil.statusCode = 404;
      throw erroPerfil;
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
      const { nome, sobrenome, telefone, descricao } = dadosPerfil || {};

      const updates = {};

      if (nome !== undefined) {
        updates.nome = nome || "";
      }

      if (sobrenome !== undefined) {
        updates.sobrenome = sobrenome || "";
      }

      if (telefone !== undefined) {
        updates.telefone = telefone || "";
      }

      if (descricao !== undefined) {
        updates.descricao = descricao || "";
      }

      if (redes_sociais !== undefined) {
        updates.redes_sociais =
          typeof redes_sociais === "string"
            ? JSON.parse(redes_sociais)
            : redes_sociais;
      }

      if (Object.keys(updates).length > 0) {
        await PerfilModel.atualizarPerfil(userId, updates);
      }

      const perfilAtualizado = await PerfilModel.buscarPerfil(userId);

      return this._formatarPerfil(perfilAtualizado);
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
      const extensao = file.originalname.split(".").pop();

      const { extensao: extensaoValida } = validarMetadadosUpload({
        tipo: "imagem_perfil",
        extensao,
        mimeType: file.mimetype,
        tamanho: file.size ?? file.buffer.length,
      });

      const nomeArquivo = `perfil_${Date.now()}.${extensaoValida}`;

      const perfil = await PerfilModel.atualizarApenasImagem(
        userId,
        file,
        nomeArquivo,
      );

      return this._formatarPerfil(perfil);
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
      const perfil = await PerfilModel.removerImagem(userId);

      return this._formatarPerfil(perfil);
    } catch (error) {
      if (error.statusCode) throw error;

      const erroBanco = new Error("Erro ao remover a foto de perfil.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }
}
