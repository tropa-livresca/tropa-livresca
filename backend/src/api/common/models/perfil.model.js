import {
  criarClienteModel,
  marcarErro,
  obterIdPerfil,
} from "./pocketbase.helpers.js";

const COLECAO_PERFIL = "users_profile";
const COLECAO_USUARIOS = "users";

export class PerfilModel {
  static async buscarPerfil(id) {
    const pb = criarClienteModel();
    const perfilId = await obterIdPerfil(pb, id);

    try {
      const perfil = await pb.collection(COLECAO_PERFIL).getOne(perfilId);

      const usuarioId = perfil.auth_user || id;

      const usuario = await pb.collection(COLECAO_USUARIOS).getOne(usuarioId);

      return {
        ...perfil,
        nome: usuario.nome || "",
        sobrenome: usuario.sobrenome || "",
      };
    } catch (error) {
      if (error.status === 404) return null;
      marcarErro(error);
    }
  }

  static async atualizarNomeUsuario(userId, dados) {
    const pb = criarClienteModel();

    try {
      return await pb.collection(COLECAO_USUARIOS).update(userId, dados);
    } catch (error) {
      marcarErro(error);
    }
  }

  static async atualizarPerfil(userId, dadosPerfil) {
    const pb = criarClienteModel();
    const perfilId = await obterIdPerfil(pb, userId);

    try {
      return await pb.collection(COLECAO_PERFIL).update(perfilId, dadosPerfil);
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

    const pb = criarClienteModel();

    try {
      const formData = new FormData();

      const blob = new Blob([arquivo.buffer], {
        type: arquivo.mimetype,
      });

      formData.append("imagem", blob, nomeArquivo);

      return await pb
        .collection(COLECAO_PERFIL)
        .update(perfil.id, formData)
        .then(async (registro) => {
          const usuario = await pb
            .collection(COLECAO_USUARIOS)
            .getOne(registro.auth_user || userId);

          return {
            ...registro,
            nome: usuario.nome || "",
            sobrenome: usuario.sobrenome || "",
          };
        });
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

    const pb = criarClienteModel();

    try {
      const formData = new FormData();
      formData.append("imagem-", "");

      const registro = await pb
        .collection(COLECAO_PERFIL)
        .update(perfil.id, formData);

      return {
        ...registro,
        nome: perfil.nome,
        sobrenome: perfil.sobrenome,
      };
    } catch (error) {
      marcarErro(error);
    }
  }
}
