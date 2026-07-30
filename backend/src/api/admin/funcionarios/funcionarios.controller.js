import { FuncionariosService } from "./funcionarios.service.js";

export class FuncionariosController {
  static async promoverAdm(req, res, next) {
    const { usuarioComumId, senhaTemporaria, funcao } = req.body;

    try {
      const data = await FuncionariosService.promoverAdm(
        usuarioComumId,
        senhaTemporaria,
        funcao,
      );

      return res.status(201).json({
        success: true,
        message: "Usuário promovido com sucesso!",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async atualizarFuncao(req, res, next) {
    const { funcionarioId, funcao } = req.body;

    try {
      const data = await FuncionariosService.atualizarCargo(
        funcionarioId,
        funcao,
      );

      return res.json({
        success: true,
        message: "Cargo de funcionário alterado com sucesso!",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deletarFuncionario(req, res, next) {
    const { funcionarioId } = req.body;

    try {
      const data = await FuncionariosService.deletarFuncionario(funcionarioId);

      return res.json({
        success: true,
        message: "Usuário deletado com sucesso!",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  }
}
