import { RevisaoService } from "./revisao.service.js";

export class RevisaoController {
  static async BuscarLivroRevisao(req, res, next) {
    try {
      const busca = req.query.busca || "";
      const livros = await RevisaoService.BuscarLivroRevisao(busca);

      return res.status(200).json(livros);
    } catch (err) {
      next(err);
    }
  }

  static async BuscarRevisoes(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 12;
      const busca = req.query.busca || "";
      const filtro = req.query.filtro || "";
      const ordem = req.query.ordem || "";
      const livro = req.query.livro || "";

      const revisoes = await RevisaoService.BuscarRevisoes({
        page,
        limit,
        busca,
        filtro,
        ordem,
        livro,
      });

      return res.status(200).json(revisoes);
    } catch (err) {
      next(err);
      return res.json(err.message);
    }
  }

  static async BuscarRevisaoById(req, res, next) {
    try {
      const { id } = req.params;

      const revisao = await RevisaoService.BuscarRevisaoById(id);

      return res.status(200).json(revisao);
    } catch (err) {
      next(err);
    }
  }

  static async AtualizarRevisao(req, res, next) {
    try {
      const { id } = req.params;
      const nome = req.body.nome !== undefined ? req.body.nome : undefined;
      const apontamento =
        req.body.apontamento !== undefined ? req.body.apontamento : undefined;
      const idLivro =
        req.body.idLivro !== undefined ? req.body.idLivro : undefined;

      const revisaoAtualizada = await RevisaoService.AtualizarRevisao(
        id,
        nome,
        apontamento,
        idLivro,
      );

      return res.status(200).json(revisaoAtualizada);
    } catch (err) {
      next(err);
    }
  }

  static async CriarRevisao(req, res, next) {
    try {
      const userId = req.user?.id || req.userId || req.usuario;
      const nome = req.body.nome;
      const apontamento = req.body.apontamento;
      const idLivro = req.body.idLivro;
      const manuscritoRevisto = req.file || req.body.manuscritoRevisto || null;

      const novaRevisao = await RevisaoService.CriarRevisao(
        nome,
        apontamento,
        idLivro,
        manuscritoRevisto,
        userId,
      );

      return res.status(201).json(novaRevisao);
    } catch (err) {
      next(err);
    }
  }

  static async InativarRevisao(req, res, next) {
    try {
      const { id } = req.params;

      const revisaoInativada = await RevisaoService.InativarRevisao(id);

      return res.status(200).json(revisaoInativada);
    } catch (err) {
      next(err);
    }
  }

  static async PublicarLivro(req, res, next) {
    try {
      const { idLivro } = req.body;
      const userId = req.user.id;

      const livroPublicado = await RevisaoService.publicarLivro(
        idLivro,
        userId,
      );

      return res.status(200).json(livroPublicado);
    } catch (err) {
      next(err);
    }
  }

  static async SolicitarCorrecaoLivro(req, res, next) {
    try {
      const { idLivro } = req.body;
      const userId = req.user.id;

      const livroPublicado = await RevisaoService.solicitarCorrecaoLivro(
        idLivro,
        userId,
      );

      return res.status(200).json(livroPublicado);
    } catch (err) {
      next(err);
    }
  }

  static async NegarPublicacaoLivro(req, res, next) {
    try {
      const { idLivro } = req.body;
      const userId = req.user.id;

      const livroPublicado = await RevisaoService.negarPublicacaoLivro(
        idLivro,
        userId,
      );

      return res.status(200).json(livroPublicado);
    } catch (err) {
      next(err);
    }
  }
}
