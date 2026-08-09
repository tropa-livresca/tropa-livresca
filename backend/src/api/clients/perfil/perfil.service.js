import { supabaseAdmin } from "../../common/config/supabase.js";
import { PerfilModel } from "../../common/models/perfil.model.js";

export class PerfilService {
  
  static _extrairPathDaUrl(url) {
    if (!url) return null;
    const urlSemQuery = url.split("?")[0];
    const partes = urlSemQuery.split("/storage/v1/object/public/public_box/");
    return partes.length > 1 ? partes[1] : null;
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

    return perfil;
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
        updates.redes_sociais = typeof redes_sociais === "string" 
          ? JSON.parse(redes_sociais) 
          : redes_sociais;
      }

      return await PerfilModel.atualizarPerfil(userId, updates);
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
      const erroArquivo = new Error("Arquivo de mídia corrompido ou inválido no servidor.");
      erroArquivo.statusCode = 400;
      throw erroArquivo;
    }

    try {
      const perfilAtual = await PerfilModel.buscarPerfil(userId);
      const urlImagemAntiga = perfilAtual?.imagem;

      const timestamp = Date.now();
      const extensao = file.originalname.split(".").pop();
      const filePath = `images/${userId}/perfil_${timestamp}.${extensao}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("public_box")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        uploadError.statusCode = 500;
        throw uploadError;
      }

      const responseUrl = supabaseAdmin.storage
        .from("public_box")
        .getPublicUrl(filePath);
      
      const novaPublicUrl = responseUrl?.data?.publicUrl || responseUrl?.publicUrl;

      if (!novaPublicUrl) {
        const erroUrl = new Error("Não foi possível gerar a URL pública da imagem.");
        erroUrl.statusCode = 500;
        throw erroUrl;
      }

      const perfilData = await PerfilModel.atualizarApenasImagem(userId, novaPublicUrl);

      if (urlImagemAntiga) {
        const antigoPath = this._extrairPathDaUrl(urlImagemAntiga);
        if (antigoPath) {
          supabaseAdmin.storage.from("public_box").remove([antigoPath]).catch(() => {});
        }
      }

      return perfilData;
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

      if (urlImagemAntiga) {
        const antigoPath = this._extrairPathDaUrl(urlImagemAntiga);
        if (antigoPath) {
          supabaseAdmin.storage.from("public_box").remove([antigoPath]).catch(() => {});
        }
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
