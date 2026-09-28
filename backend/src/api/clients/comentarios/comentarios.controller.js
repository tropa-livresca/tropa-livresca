import { ComentarioService } from "./comentarios.service.js";

export class ComentarioController {
  static async buscarComentarios(req, res, next) {
    try {
      const idLivro = req.param?.id;
      const { limit, secao } = req.body;

      const comentarios = await ComentarioService.buscarComentarios(
        idLivro,
        limit,
        secao,
      );

      return res.status(201).json({ comentarios });
    } catch (err) {
      next(err);
    }
  }

  static async deletarComentario(req, res, next) {
    try {
      const idUsuario = req.user?.id;
      const idComentario = req.body;

      const comentarioDeletado = await ComentarioService.deletarComentario(
        idUsuario,
        idComentario,
      );

      return res.status(201).json({ comentarioDeletado });
    } catch (err) {
      next(err);
    }
  }

  static async criarComentario(req, res, next) {
    try {
      const usuarioId = req.user?.id;
      const livroId = req.params.id;
      const { texto } = req.body;

      const novoComentario = await ComentarioService.criarComentario(
        usuarioId,
        livroId,
        texto,
      );

      return res.status(201).json({ novoComentario });
    } catch (err) {
      next(err);
    }
  }

  static async atualizarComentario(req, res, next) {
    try {
      const usuarioId = req.user?.id;
      const comentarioId = req.body.id;
      const { texto } = req.body;

      const comentarioAtualizado = await ComentarioService.atualizarComentario(
        comentarioId,
        usuarioId,
        texto,
      );

      return res.status(201).json({ comentarioAtualizado });
    } catch (err) {
      next(err);
    }
  }
}
