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

        console.log(usuarios.count)
  
        return {data:usuarios.data, 
          count: usuarios.count,
          meta: {
          page,
          limit,
          totalItems: usuarios.count,
          totalPages: Math.ceil(usuarios.count / limit),
        }};
      } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        throw error;
      }
    }
}
