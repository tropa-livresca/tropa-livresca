import { AutopublicacaoService } from "./autopublicacao.service.js";

export class AutopublicacaoController {
  static async GetLivrosById(req, res, next) {
    try {
      const userId = req.user.id;
      const livrosComCapas = await AutopublicacaoService.getLivrosById(userId);

      return res.status(200).json(livrosComCapas);
    } catch (err) {
      next(err);
    }
  }

  static async UpdateEstado(req, res, next) {
    try {
      const { id } = req.params;
      const { novoEstado } = req.body;

      await AutopublicacaoService.updateEstado(id, novoEstado);

      return res.status(200).end();
    } catch (err) {
      next(err);
    }
  }

  static async InativarLivro(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await AutopublicacaoService.inativarLivro(id, userId);

      return res.status(200).end();
    } catch (err) {
      next(err);
    }
  }

  static async DeletarLivroRascunho(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await AutopublicacaoService.deletarLivroRascunho(id, userId);

      return res.status(200).end();
    } catch (err) {
      next(err);
    }
  }

  static async InsertLivro(req, res, next) {
    try {
      const userId = req.user?.id;
      const { dadosLivro, estadoInicial, capa, manuscritoPath } = req.body;

      const resultado = await AutopublicacaoService.insertLivroService({
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

  static async CriarUploadLivro(req, res, next) {
    try {
      const userId = req.user?.id;
      const { tipo, extensao } = req.body;

      const resultado = await AutopublicacaoService.criarUploadLivroService({
        userId,
        tipo,
        extensao,
      });

      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async BuscarComFiltros(req, res, next) {
    try {
      const userId = req.user.id;
      const { page, limit, busca, filtro, ordem, estado } = req.query;

      const resultado = await AutopublicacaoService.buscarComFiltros({
        userId,
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
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

  static async UpdateLivro(req, res, next) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { dadosLivro, capa, manuscritoPath } = req.body;

      const resultado = await AutopublicacaoService.updateLivroService({
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
