import {
  criarClienteModel,
  marcarErro,
  mapearCampoArquivo,
} from "./pocketbase.helpers.js";

const COLECAO_PERFIL = "users_profile";

export class PerfilModel {
  static async buscarPerfil(id) {
    const pb = await criarClienteModel();

    try {
      const perfil = await pb.collection(COLECAO_PERFIL).getOne(id);

      return {
        ...perfil,
        ...mapearCampoArquivo(pb, perfil, "imagem"),
        nome: perfil.nome || "",
        sobrenome: perfil.sobrenome || "",
      };
    } catch (error) {
      if (error.status === 404) return null;
      marcarErro(error);
    }
  }

  static async atualizarNomeUsuario(userId, dados) {
    const pb = await criarClienteModel();

    try {
      return await pb.collection(COLECAO_PERFIL).update(userId, dados);
    } catch (error) {
      marcarErro(error);
    }
  }

  static async atualizarPerfil(userId, dadosPerfil) {
    const pb = await criarClienteModel();

    try {
      const registro = await pb
        .collection(COLECAO_PERFIL)
        .update(userId, dadosPerfil);

      return {
        ...registro,
        ...mapearCampoArquivo(pb, registro, "imagem"),
        nome: registro.nome || "",
        sobrenome: registro.sobrenome || "",
      };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async atualizarApenasImagem(userId, arquivo, nomeArquivo) {
    const perfil = await this.buscarPerfil(userId);

    if (!perfil) {
      const error = new Error("Nenhum perfil foi encontrado para atualização.");
      error.statusCode = 404;
      throw error;
    }

    const pb = await criarClienteModel();

    try {
      const formData = new FormData();

      const blob = new Blob([arquivo.buffer], {
        type: arquivo.mimetype,
      });

      formData.append("imagem", blob, nomeArquivo);

      const registro = await pb
        .collection(COLECAO_PERFIL)
        .update(userId, formData);

      return {
        ...registro,
        ...mapearCampoArquivo(pb, registro, "imagem"),
        nome: registro.nome || "",
        sobrenome: registro.sobrenome || "",
      };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async removerImagem(userId) {
    const perfil = await this.buscarPerfil(userId);

    if (!perfil) {
      const error = new Error("Nenhum perfil foi encontrado para atualização.");
      error.statusCode = 404;
      throw error;
    }

    const pb = await criarClienteModel();

    try {
      const formData = new FormData();

      for (const nomeArquivo of Array.isArray(perfil.imagem)
        ? perfil.imagem
        : [perfil.imagem]) {
        if (nomeArquivo) {
          formData.append("imagem-", nomeArquivo);
        }
      }

      const registro = await pb
        .collection(COLECAO_PERFIL)
        .update(userId, formData);

      return {
        ...registro,
        ...mapearCampoArquivo(pb, registro, "imagem"),
        nome: registro.nome || "",
        sobrenome: registro.sobrenome || "",
      };
    } catch (error) {
      marcarErro(error);
    }
  }
}
 