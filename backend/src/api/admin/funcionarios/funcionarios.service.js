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

  static async alterarFuncao(usuarioId, funcao) {
    if (!usuarioId) {
      const erroDados = new Error("Id do usuário e/ou funcao não informado");
      erroDados.statusCode = 400;
      throw erroDados;
    }

<<<<<<< HEAD
    if (funcao !== "Master" && funcao !== "funcionario") {
=======
    if (funcao !== true && funcao !== false) {
>>>>>>> 0f4e28e6ed5fea4f341e4bf88a810accd0361802
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
        await FuncionariosModel.inativarFuncionario(funcionarioId);

      return resultado;
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }
}
