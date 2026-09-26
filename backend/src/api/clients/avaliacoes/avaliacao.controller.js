import { AvaliacaoService } from "./avaliacao.service.js";

export class AvaliacaoController {
  static async criarAvaliacao(req, res, next) {
    try {
      const livroId = req.params.id;
      const usuarioId = req.user?.id;
      const qtd_estrelas = req.body.qtd_estrelas;

      const avaliacaoCriada = await AvaliacaoService.criarAvaliacao(
        livroId,
        usuarioId,
        qtd_estrelas,
      );

      return res.status(201).json({ avaliacaoCriada });
    } catch (err) {
      next(err);
    }
  }

  static async alterarAvaliacao(req, res, next) {
    try {
      const usuarioId = req.user?.id;
      const avaliacaoId = req.body.id;
      const qtd_estrelas = req.body.qtd_estrelas;

      const avaliacaoAtualizada = await AvaliacaoService.alterarAvaliacao(
        usuarioId,
        avaliacaoId,
        qtd_estrelas,
      );

      return res.status(201).json({ avaliacaoAtualizada });
    } catch (err) {
      next(err);
    }
  }

  static async buscarAvaliacoesLivro(req, res, next) {
    try {
      const livroId = req.params.id;

      const avaliacoes = await AvaliacaoService.buscarAvaliacoesLivro(livroId);

      return res.status(201).json({ avaliacoes });
    } catch (err) {
      next(err);
    }
  }
}
