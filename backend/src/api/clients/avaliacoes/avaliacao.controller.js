import { AvaliacaoService } from "./avaliacao.service.js";

export class AvaliacaoController {
  static async buscarResumoLivro(req, res, next) {
    try {
      const resumo = await AvaliacaoService.buscarResumoLivro(req.params.id);

      return res.status(200).json(resumo);
    } catch (err) {
      next(err);
    }
  }

  static async buscarAvaliacao(req, res, next) {
    try {
      const resultado = await AvaliacaoService.buscarAvaliacao(
        req.user?.id,
        req.params.id,
      );

      return res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  }

  static async salvarAvaliacao(req, res, next) {
    try {
      const avaliacao = await AvaliacaoService.salvarAvaliacao(
        req.user?.id,
        req.params.id,
        req.body.qtd_estrelas,
      );

      return res.status(200).json({ avaliacao });
    } catch (err) {
      next(err);
    }
  }
}
