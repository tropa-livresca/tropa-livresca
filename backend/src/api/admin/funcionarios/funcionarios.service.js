import { FuncionariosModel } from "../../common/models/funcionarios.model.js";

export class FuncionariosService {
  static async buscarFuncionarioById(funcionarioId) {
    const funcionario =
      await FuncionariosModel.buscarFuncionarioById(funcionarioId);

    if (!funcionario) {
      const erroFuncionario = new Error("Funcionário não encontrado.");
      erroFuncionario.statusCode = 404;
      throw erroFuncionario;
    }

    if (funcionario.error) {
      throw funcionario.error;
    }

    return funcionario;
  }

  static async buscarFuncionarios({
    page = 1,
    limit = 12,
    busca = "",
    ordem = "",
  }) {
    const funcionarios = await FuncionariosModel.buscarFuncionarios({
      page,
      limit,
      busca,
      ordem,
    });

    if (!funcionarios) {
      const erroFuncionarios = new Error("Erro ao buscar funcionários.");
      erroFuncionarios.statusCode = 400;
      throw erroFuncionarios;
    }

    if (funcionarios.error) {
      throw funcionarios.error;
    }

    const totalItems = funcionarios.count;

    return {
      data: funcionarios,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  static async alterarFuncao(usuarioId, funcao) {
    if (!usuarioId) {
      const erroDados = new Error("Id do usuário e/ou funcao não informado");
      erroDados.statusCode = 400;
      throw erroDados;
    }

    if (funcao !== "Master" && funcao !== "funcionarios") {
      const erroFuncao = new Error("A função informado é inválida.");
      erroFuncao.statusCode = 400;
      throw erroFuncao;
    }

    try {
      const resultado = await FuncionariosModel.alterarFuncao(
        usuarioId,
        funcao,
      );

      return resultado;
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }

  static async alterarIsAdminFuncionario(funcionarioId) {
    if (!funcionarioId) {
      const erroId = new Error("Funcionário a deletar não informado.");
      throw erroId;
    }

    try {
      const resultado =
        await FuncionariosModel.alterarIsAdminFuncionario(funcionarioId);

      return resultado;
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }
}
