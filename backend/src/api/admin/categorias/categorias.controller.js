import { CategoriasService } from "./categorias.service.js";

export class CategoriasController {
  static async BuscarCategorias(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 12;
      const busca = req.query.busca || "";
      const filtro = req.query.filtro || "";
      const ordem = req.query.ordem || "";
      const tipo = req.query.tipo || "";

      const resultado = await CategoriasService.BuscarCategorias({
        page,
        limit,
        busca,
        filtro,
        ordem,
        tipo,
      });

      return res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  }

  static async BuscarCategoriaById(req, res, next) {
    try {
      const { id } = req.params;

      const categoriaById = await CategoriasService.BuscarCategoriaById(id);

      return res.status(200).json(categoriaById);
    } catch (err) {
      next(err);
    }
  }

  static async InativarCategoria(req, res, next) {
    try {
      const { id } = req.params;

      const categoriaById = await CategoriasService.InativarCategoria(id);

      return res.status(200).json(categoriaById);
    } catch (err) {
      next(err);
    }
  }

  static async AtualizarCategoria(req, res, next) {
    try {
      const { id } = req.params;
      const dadosAtualizados = req.body;

      const categoriaAtualizada = await CategoriasService.AtualizarCategoria(
        id,
        dadosAtualizados,
      );

      return res.status(200).json(categoriaAtualizada);
    } catch (err) {
      next(err);
    }
  }

  static async CriarCategoria(req, res, next) {
    try {
      const userId = req.user?.id;
      const nome = req.body.nome;
      const tipo = req.body.tipo;
      const descricao = req.body.descricao;

      const categoriaCriada = await CategoriasService.CriarCategoriaLivro(
        userId,
        nome,
        tipo,
        descricao,
      );

      return res.status(200).json(categoriaCriada);
    } catch (err) {
      next(err);
    }
  }
}
