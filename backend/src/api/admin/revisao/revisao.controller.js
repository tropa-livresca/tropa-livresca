import { RevisaoService } from "./revisao.service.js";

export class RevisaoController {
  static async BuscarRevisoes(req, res, next) {
    try {
      const page = parseInt(req.body.page, 10) || 1;
      const limit = parseInt(req.body.limit, 10) || 12;
      const busca = req.body.busca || "";
      const filtro = req.body.filtro || "";
      const ordem = req.body.ordem || "";

      const revisoes = await RevisaoService.BuscarRevisoes({
        page,
        limit,
        busca,
        filtro,
        ordem,
      });

      return res.status(200).json(revisoes);
    } catch (err) {
      next(err);
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
      const nome = req.body.nome || "";
      const apontamento = req.body.apontamento || "";
      const idLivro = req.body.idLivro;

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
      const userId = req.user?.id;
      const nome = req.body.nome;
      const apontamento = req.body.apontamento;
      const idLivro = req.body.idLivro;

      const novaRevisao = await RevisaoService.CriarRevisao(
        userId,
        nome,
        apontamento,
        idLivro,
      );

      return res.status(200).json(novaRevisao);
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

      return livroRevisado;
    } catch (err) {
      next(err);
    }
  }
}
