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
}
