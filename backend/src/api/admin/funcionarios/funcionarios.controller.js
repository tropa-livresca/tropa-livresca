import { FuncionariosService } from "./funcionarios.service.js";

export class FuncionariosController {
  static async buscarFuncionarioById(req, res, next) {
    try {
      const { funcionarioId } = req.params;

      const funcionario =
        await FuncionariosService.buscarFuncionarioById(funcionarioId);

      return res.status(200).json({
        funcionario,
      });
    } catch (err) {
      next(err);
    }
  }
  static async buscarFuncionarios(req, res, next) {
    const { page, limit, busca, ordem } = req.params;

    try {
      const data = await FuncionariosService.buscarFuncionarios({
        page,
        limit,
        busca,
        ordem,
      });

      return res.status(201).json({
        data: data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async alterarFuncao(req, res, next) {
    const { usuarioId, is_master } = req.body;

    try {
      const data = await FuncionariosService.alterarFuncao(
        usuarioId,
        is_master,
      );

      return res.status(201).json({
        success: true,
        message: "função de Usuário modificada com sucesso!",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async alterarIsAdminFuncionario(req, res, next) {
    const { funcionarioId } = req.params;

    try {
      const data =
        await FuncionariosService.alterarIsAdminFuncionario(funcionarioId);

      return res.json({
        success: true,
        message: "Usuário inativado com sucesso!",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  }
}
