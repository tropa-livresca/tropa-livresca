import { LivrosService } from "./livros.service.js";

export class LivrosController {
  static async GetLivros(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 12;
      const busca = req.query.busca || "";
      const filtro = req.query.filtro || "";
      const ordem = req.query.ordem || "";

      const resultado = await LivrosService.getLivros({ page, limit, busca, filtro, ordem });

      return res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  }

  static async GetLivrosByAutor(req, res, next) {
    try {
      const { id } = req.params;
      const livroDetalhes = await LivrosService.getLivrosByAutor(id);

      return res.status(200).json(livroDetalhes);
    } catch (err) {
      next(err);
    }
  }

  static async GetLivrosById(req, res, next) {
    try {
      const { id } = req.params;
      const livro = await LivrosService.getLivrosById(id);

      return res.status(200).json(livro);
    } catch (err) {
      next(err);
    }
  }
}
