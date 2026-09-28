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

  static async promoverUsuario(usuarioId) {
    if (!usuarioId) {
      const erroDados = new Error(
        "Dados não informados para alteração da função.",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    const resultado = await UsuariosModel.promoverUsuario(usuarioId);

    if (resultado.error) throw resultado.error;

    return resultado;
  }

  static async alterarIsMasterFuncionario(funcionarioId, isMaster) {
    if (!funcionarioId || !isMaster) {
      const erroDados = new Error(
        "Dados não informados para alteração da função.",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    const resultado = await UsuariosModel.alterarIsMasterFuncionario(
      funcionarioId,
      isMaster,
    );

    if (resultado.error) throw resultado.error;

    return resultado;
  }

  static async inativarFuncionario(funcionarioId) {
    if (!funcionarioId) {
      const erroId = new Error("Funcionário a inativar não informado.");
      throw erroId;
    }

    try {
      const resultado = await UsuariosModel.inativarFuncionario(funcionarioId);

      return resultado;
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }
}
