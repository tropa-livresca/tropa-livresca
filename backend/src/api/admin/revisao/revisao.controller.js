import { RevisaoService } from "./revisao.service";

export class RevisaoController {
  static async BuscarRevisoes(req, res, next) {
    try {
        const revisoes = await RevisaoService.BuscarRevisoes();

        return res.status(200).json(revisoes);
    } catch (err) {
      next(err);
    }
  }

  static async BuscarRevisaoById(req, res, next) {
    try {
        const revisao = await RevisaoService.BuscarRevisaoById();

        return res.status(200).json(revisao);
    } catch (err) {
      next(err);
    }
  }

  static async AtualizarRevisao(req, res, next) {
    try {
        const revisaoAtualizada = await RevisaoService.AtualizarRevisao();

        return res.status(200).json(revisaoAtualizada);
    } catch (err) {
      next(err);
    }
  }

  static async CriarRevisao(req, res, next) {
    try {
        const novaRevisao = await RevisaoService.CriarRevisao();

        return res.status(200).json(novaRevisao);
    } catch (err) {
      next(err);
    }
  }

  static async InativarRevisao(req, res, next) {
    try {
        const revisaoInativada = await RevisaoService.InativarRevisao();

        return res.status(200).json(revisaoInativada);
    } catch (err) {
      next(err);
    }
  }
}
