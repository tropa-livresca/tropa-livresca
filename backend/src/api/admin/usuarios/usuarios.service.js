import { UsuariosModel } from "../../common/models/usuarios.model.js";
export class UsuariosService {
  static async buscarUsuarios(
    page = 1,
    limit = 12,
    busca = "",
    ordem = "",
    filtro = "",
  ) {
    try {
      const usuarios = await UsuariosModel.buscarUsuarios({
        page,
        limit,
        busca,
        ordem,
        filtro,
      });

      return {
        data: usuarios.data,
        meta: {
          page,
          limit,
          totalItems: usuarios.count,
          totalPages: Math.ceil(usuarios.count / limit),
        },
      };
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async BuscarUsuarioById(usarioId) {
    if (!usarioId) {
      const erroUsarioId = new Error("Id do livro não informado.");
      erroUsarioId.statusCode = 400;
      throw erroUsarioId;
    }

    try {
      const usuario = await UsuariosModel.buscarUsuarioById(usarioId);
      return usuario;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 400;
      throw error;
    }
  }
}
