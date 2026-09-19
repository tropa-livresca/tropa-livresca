import { FuncionariosService } from "./funcionarios.service.js";

export class FuncionariosController {
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

      return res.status(201).json({ data });
    } catch (err) {
      next(err);
    }
  }

  static async alterarIsMasterFuncionario(req, res, next) {
    const { funcionarioId, isMaster } = req.body;

    try {
      const data = await FuncionariosService.alterarIsMasterFuncionario(
        funcionarioId,
        isMaster,
      );

      return res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  static async inativarFuncionario(req, res, next) {
    const { funcionarioId } = req.body;

    try {
      const data = await FuncionariosService.inativarFuncionario(funcionarioId);

      return res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  static async promoverUsuario(req, res, next) {
    const { funcionarioId } = req.body;

    try {
      const data = await FuncionariosService.promoverUsuario(funcionarioId);

      return res.json({
        success: true,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  }
}
