import { RevisaoService } from "./revisao.service.js";

export class RevisaoController {
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
      const apontamento = req.body.apontamento !== undefined ? req.body.apontamento : undefined;
      const idLivro = req.body.idLivro !== undefined ? req.body.idLivro : undefined;

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

  static async AlterarEstadoLivro(req, res, next) {
    try {
      const idLivro = req.body.idLivro;
      const novoEstado = req.body.novoEstado;

      const livroRevisado = await RevisaoService.AlterarEstadoLivro(idLivro, novoEstado);

      return res.status(200).json(livroRevisado);
    } catch (err) {
      next(err);
    }
  }
}
