import { UsuariosService } from "./usuarios.service.js";

export class UsuariosController {
  static async buscarUsuarios(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 12;
      const busca = req.query.busca || "";
      const ordem = req.query.ordem || "";

      const filtro = req.query.filtro || "";

      const resultado = await UsuariosService.buscarUsuarios(
        page,
        limit,
        busca,
        ordem,
        filtro,
      );

      return res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  }

  static async BuscarUsuarioById(req, res, next) {
    try {
      const { id } = req.params;

      const usuario = await UsuariosService.BuscarUsuarioById(id);
      return res.status(200).json(usuario);
    } catch (err) {
      next(err);
    }
  }

  static async alterarIsMasterFuncionario(req, res, next) {
    const { funcionarioId, isMaster } = req.body;

    try {
      const data = await UsuariosService.alterarIsMasterFuncionario(
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
      const data = await UsuariosService.inativarFuncionario(funcionarioId);

      return res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  static async promoverUsuario(req, res, next) {
    const { funcionarioId } = req.body;

    try {
      const data = await UsuariosService.promoverUsuario(funcionarioId);

      return res.json({
        success: true,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  }
}
