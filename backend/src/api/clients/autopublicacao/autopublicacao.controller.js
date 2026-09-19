import { AutopublicacaoService } from "./autopublicacao.service.js";

export class AutopublicacaoController {
  static async buscarLivroById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const livro = await AutopublicacaoService.buscarDetalhesPorId(id, userId);

      return res.status(200).json(livro);
    } catch (err) {
      next(err);
    }
  }

  static async atualizarEstado(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const livro = await AutopublicacaoService.atualizarEstado(id, userId);

      return res.status(200).json(livro);
    } catch (err) {
      next(err);
    }
  }

  static async deletarLivroRascunho(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await AutopublicacaoService.deletarLivroRascunho(id, userId);

      return res.status(200).end();
    } catch (err) {
      next(err);
    }
  }

  static async criarLivro(req, res, next) {
    try {
      const userId = req.user?.id;
      const { dadosLivro, estadoInicial, capa, manuscritoPath } = req.body;

      const resultado = await AutopublicacaoService.criarLivro({
        userId,
        dadosLivro,
        estadoInicial,
        capa,
        manuscritoPath,
      });

      return res.status(201).json(resultado);
    } catch (err) {
      next(err);
    }
  }

  static async criarUploadLivro(req, res, next) {
    try {
      const userId = req.user?.id;
      const { tipo, extensao } = req.body;

      const resultado = await AutopublicacaoService.criarUploadLivro({
        userId,
        tipo,
        extensao,
      });

      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async buscarComFiltros(req, res, next) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 12;
      const busca = req.query.busca || "";
      const filtro = req.query.filtro || "";
      const ordem = req.query.ordem || "";
      const estado = req.query.estado || "";

      const resultado = await AutopublicacaoService.buscarComFiltros({
        userId,
        page,
        limit,
        busca,
        filtro,
        ordem,
        estado,
      });

      return res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  }

  static async atualizarLivro(req, res, next) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { dadosLivro, capa, manuscritoPath } = req.body;

      const resultado = await AutopublicacaoService.atualizarLivro({
        userId,
        livroId: id,
        dadosLivro,
        capa,
        manuscritoPath,
      });

      return res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  }
}
