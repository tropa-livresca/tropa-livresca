import { FuncionariosModel } from "../../common/models/funcionarios.model.js";

export class FuncionariosService {
  static async buscarFuncionarios({
    page = 1,
    limit = 12,
    busca = "",
    ordem = "",
    filtro = "",
  }) {
    const funcionarios = await FuncionariosModel.buscarFuncionarios({
      page,
      limit,
      busca,
      ordem,
      filtro,
    });

    if (!funcionarios) {
      const erroFuncionarios = new Error("Erro ao buscar funcionários.");
      erroFuncionarios.statusCode = 400;
      throw erroFuncionarios;
    }

    if (funcionarios.error) {
      throw funcionarios.error;
    }

    return {
      data: funcionarios.data,
      meta: {
        page,
        limit,
        totalItems: funcionarios.count,
        totalPages: Math.ceil(funcionarios.count / limit),
      },
    };
  }

  static async promoverUsuario(usuarioId) {
    if (!usuarioId) {
      const erroDados = new Error(
        "Dados não informados para alteração da função.",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    const resultado = await FuncionariosModel.promoverUsuario(usuarioId);

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

    const resultado = await FuncionariosModel.alterarIsMasterFuncionario(
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
      const resultado =
        await FuncionariosModel.inativarFuncionario(funcionarioId);

      return resultado;
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }
}
