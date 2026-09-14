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

      return usuarios;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }
}
