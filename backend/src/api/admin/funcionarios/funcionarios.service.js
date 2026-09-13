import { FuncionariosModel } from "../../common/models/funcionarios.model.js";

export class FuncionariosService {
  static async alterarFuncao(usuarioId, funcao) {
    if (!usuarioId) {
      const erroDados = new Error(
        "Id do usuário e/ou funcao não informado",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    try {
      const resultado = await FuncionariosModel.alterarFuncao(
        usuarioId, funcao
      );

      return resultado;
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }

  static async deletarFuncionario(funcionarioId) {
    if (!funcionarioId) {
      const erroId = new Error("Funcionário a deletar não informado.");
      throw erroId;
    }

    try {
      const resultado =
        await FuncionariosModel.deletarFuncionario(funcionarioId);

      return resultado;
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }

  static async atualizarCargo(funcionarioId, funcao) {
    if (!funcionarioId || !funcao) {
      const erroCredenciais = new Error(
        "Função ou id do funcionário não fornecido.",
      );
      erroCredenciais.statusCode = 400;
      throw erroCredenciais;
    }

    try {
      const resultado = await FuncionariosModel.atualizarCargo(
        funcionarioId,
        funcao,
      );

      return resultado;
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }
  }
}
