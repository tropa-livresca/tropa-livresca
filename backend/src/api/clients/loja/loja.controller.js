import { LojaService } from "./loja.service.js";

export class LojaController {
  static async buscarLivros(req, res, next) {
    try {
      const {
        page = 1,
        limit = 12,
        busca = "",
        filtro = "",
        ordem = "",
      } = req.query;

      const resultado = await LojaService.buscarLivros({
        page: Number(page),
        limit: Number(limit),
        busca,
        filtro,
        ordem,
      });

      return res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  }

  static async buscarLivroById(req, res, next) {
    try {
      const { id } = req.params;

      const livro = await LojaService.buscarLivroById(id);

      return res.status(200).json({
        data: livro,
      });
    } catch (err) {
      next(err);
    }
  }
}
