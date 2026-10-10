import { LojaService } from "./loja.service.js";

export class LojaController {
  static async consultarVendas(req, res, next) {
    try {
      const { page = 1, limit = 12, ordem = "" } = req.query;

      const vendas = await LojaService.consultarVendas({
        page: Number(page),
        limit: Number(limit),
        ordem,
      });

      return res.status(200).json(vendas);
    } catch (err) {
      next(err);
    }
  }

  static async consultarVenda(req, res, next) {
    try {
      const vendaId = req.params.id;

      const venda = await LojaService.consultarVenda(vendaId);

      return res.status(201).json({ venda });
    } catch (err) {
      next(err);
    }
  }

  static async buscarHistoricoVendasUsuario(req, res, next) {
    try {
      const usuarioId = req.params.usuarioid;

      const historico =
        await LojaService.buscarHistoricoVendasUsuario(usuarioId);

      return res.status(201).json({ historico });
    } catch (err) {
      next(err);
    }
  }

  static async buscarNumeroVendasLivro(req, res, next) {
    try {
      const livroId = req.params.id;

      const numeroVendas = await LojaService.buscarNumeroVendasLivro(livroId);

      return res.status(201).json({ numeroVendas });
    } catch (err) {
      next(err);
    }
  }

  static async buscarRelatorioFinanceiroAutor(req, res, next) {
    try {
      const usuarioId = req.params.usuarioid;

      const relatorio =
        await LojaService.buscarRelatorioFinanceiroAutor(usuarioId);

      return res.status(201).json({ relatorio });
    } catch (err) {
      next(err);
    }
  }

  static async autorizarEntrega(req, res, next) {
    try {
      const vendaId = req.params.id;

      const autorizacao = await LojaService.autorizarEntrega(vendaId);

      return res.status(201).json({ autorizacao });
    } catch (err) {
      next(err);
    }
  }

  static async alterarStatusEntrega(req, res, next) {
    try {
      const vendaId = req.params.id;

      const autorizacao = await LojaService.alterarStatusEntrega(vendaId);

      return res.status(201).json({ autorizacao });
    } catch (err) {
      next(err);
    }
  }

  static async obterEstatisticasVendas(req, res, next) {
    try {
      const { periodo } = req.query;

      const estatisticas = await LojaService.obterEstatisticasVendas(periodo);

      return res.status(201).json({ estatisticas });
    } catch (err) {
      next(err);
    }
  }
}
