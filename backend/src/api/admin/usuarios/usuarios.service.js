import { PerfilModel } from "../../common/models/perfil.model.js";

export class UsuariosService {
  static async BuscarLivros(
      page = 1,
      limit = 12,
      busca = "",
      ordem = "",
      funcao = "",
    ) {
      try {
        const usuarios = await PerfilModel.buscarPerfilAdmin({
          page,
          limit,
          busca,
          ordem,
          funcao,
          }
        );
  
        return usuarios;
      } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        throw error;
      }
    }
}
