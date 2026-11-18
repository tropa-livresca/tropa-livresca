import { AutopublicacaoService } from "./autopublicacao.service.js";

const lerDadosLivro = (valor) => {
  let dadosLivro = valor;

  if (typeof dadosLivro === "string") {
    try {
      dadosLivro = JSON.parse(dadosLivro);
    } catch {
      const error = new Error("Os dados do livro não estão em um JSON válido.");
      error.statusCode = 400;
      throw error;
    }
  }

  if (
    !dadosLivro ||
    typeof dadosLivro !== "object" ||
    Array.isArray(dadosLivro)
  ) {
    const error = new Error("Os dados do livro não foram informados.");
    error.statusCode = 400;
    throw error;
  }

  return dadosLivro;
};

export class AutopublicacaoController {
  static async buscarLivroById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const livro = await AutopublicacaoService.buscarDetalhesPorId(id, userId);

      return res.status(200).json(livro);
    } catch (err) {
      next(err);
    }
  }

  static async atualizarEstado(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { novoEstado } = req.body;

      const livro = await AutopublicacaoService.atualizarEstado({
        id,
        userId,
        novoEstado,
      });

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

      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  static async criarLivro(req, res, next) {
    try {
      const userId = req.user.id;

      const resultado = await AutopublicacaoService.criarLivro({
        userId,
        dadosLivro: lerDadosLivro(req.body?.dadosLivro),
        estadoInicial: req.body.estadoInicial,
        arquivos: req.files,
      });

      return res.status(201).json(resultado);
    } catch (err) {
      next(err);
    }
  }

  static async buscarComFiltros(req, res, next) {
    try {
      const userId = req.user.id;

      const {
        page = 1,
        limit = 12,
        busca = "",
        filtro = "",
        ordem = "",
        estado = "",
      } = req.query;

      const resultado = await AutopublicacaoService.buscarComFiltros({
        userId,
        page: Number(page),
        limit: Number(limit),
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
      const userId = req.user.id;
      const { id } = req.params;

      const resultado = await AutopublicacaoService.atualizarLivro({
        userId,
        livroId: id,
        dadosLivro: lerDadosLivro(req.body?.dadosLivro),
        arquivos: req.files,
        arquivosRemovidos: req.body.arquivosRemovidos,
      });

      return res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  }
}
