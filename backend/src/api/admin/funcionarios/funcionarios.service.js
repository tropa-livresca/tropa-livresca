import { FuncionariosModel } from "../../common/models/funcionarios.model.js";

export class FuncionariosService {
  static async promoverAdm(usuarioComumId, senhaTemporaria, funcao) {
    if (!usuarioComumId || !senhaTemporaria || !funcao) {
      const erroDados = new Error(
        "Id do usuário, senha temporária e/ou funcao não informado",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    try {
      const resultado = await FuncionariosModel.promoverAdm(
        usuarioComumId,
        senhaTemporaria,
        funcao,
      );

      return resultado;
    } catch (error) {
      const erroBanco = new Error("Erro ao executar função no banco.");
      throw erroBanco;
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
      const dbError = new Error("Erro ao deletar funcionário.");
      throw dbError;
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
      const dbError = new Error("Erro ao atualizar cargo do funcionário.");
      throw dbError;
    }
  }
}
