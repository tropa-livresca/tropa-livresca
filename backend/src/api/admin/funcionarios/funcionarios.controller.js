import { FuncionariosService } from "./funcionarios.service.js";

export class FuncionariosController {
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
    const { usuarioId, funcao } = req.body;

    try {
      const data = await FuncionariosService.alterarFuncao(usuarioId, funcao);

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
