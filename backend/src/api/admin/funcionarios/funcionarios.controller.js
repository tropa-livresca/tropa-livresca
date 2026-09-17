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
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const busca = req.query.busca || "";
    const ordem = req.query.ordem || "";

    const filtro = req.query.filtro || "";

    try {
      const data = await FuncionariosService.buscarFuncionarios({
        page,
        limit,
        busca,
        ordem,
        filtro,
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
    console.log(usuarioId);
    console.log(funcao);

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
    const { funcionarioId } = req.body;

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
