import { LivrosService } from "./livros.service.js";

export class LivroController {
  static async BuscarLivros(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 12;
      const busca = req.query.busca || "";
      const filtro = req.query.filtro || "";
      const ordem = req.query.ordem || "";
      let ativo = "";

      if (req.query.ativo === "true") ativo = true;
      if (req.query.ativo === "false") ativo = false;
      
      const estado = req.query.estado || "";

      const resultado = await LivrosService.BuscarLivros(
        page,
        limit,
        busca,
        filtro,
        ordem,
        ativo,
        estado
      );

      return res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  }

  static async BuscarLivroById(req, res, next) {
    try {
      const { id} = req.params;

      const livro = await LivrosService.BuscarLivroById(id);
      return res.status(200).json(livro);
    } catch (err) {
      next(err);
    }
  }
}
