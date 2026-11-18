import {
  criarClienteModel,
  marcarErro,
  obterIdPerfil,
} from "./pocketbase.helpers.js";

const COLECAO = "users_profile";

export class PerfilModel {
  static async buscarPerfil(id) {
    const pb = criarClienteModel();
    const perfilId = await obterIdPerfil(pb, id);

    try {
      return await pb.collection(COLECAO).getOne(perfilId);
    } catch (error) {
      if (error.status === 404) return null;
      marcarErro(error);
    }
  }

  static async atualizarPerfil(userId, dadosPerfil) {
    const pb = criarClienteModel();
    const perfilId = await obterIdPerfil(pb, userId);

    try {
      return await pb.collection(COLECAO).update(perfilId, dadosPerfil);
    } catch (error) {
      marcarErro(error);
    }
  }

  static async atualizarApenasImagem(userId, urlImagem) {
    const perfil = await this.buscarPerfil(userId);
    if (!perfil) {
      const error = new Error("Nenhum perfil foi encontrado para atualização.");
      error.statusCode = 404;
      throw error;
    }

    const pb = criarClienteModel();
    try {
      return await pb.collection(COLECAO).update(perfil.id, {
        imagem: urlImagem,
      });
    } catch (error) {
      marcarErro(error);
    }
  }
}
