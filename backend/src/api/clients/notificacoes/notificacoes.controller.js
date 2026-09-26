import { NotificacoesService } from "./notificacoes.service.js";

export class NotificacoesController {
  static async enviarNotificacao(req, res, next) {
    try {
      const { titulo, texto, tipo, metadados } = req.body;
      const usuarioId = req.user?.id;

      const notificacao = await NotificacoesService.enviarNotificacao(
        titulo,
        texto,
        tipo,
        metadados,
        usuarioId,
      );

      return res.status(201).json({ notificacao });
    } catch (err) {
      next(err);
    }
  }

  static async alterarNotificacao(req, res, next) {
    try {
      const { titulo, texto, tipo, metadados } = req.body;
      const usuarioId = req.user?.id;

      const notificacao = await NotificacoesService.alterarNotificacao(
        titulo,
        texto,
        tipo,
        metadados,
        usuarioId,
      );

      return res.status(201).json({ notificacao });
    } catch (err) {
      next(err);
    }
  }

  static async buscarNotificacao(req, res, next) {
    try {
      const notificacaoId = req.params.id;

      const notificacao =
        await NotificacoesService.buscarNotificacao(notificacaoId);

      return res.status(201).json({ notificacao });
    } catch (err) {
      next(err);
    }
  }

  static async buscarNotificacoesGerais(res, req, next) {
    try {
      const notificacoes = await NotificacoesService.buscarNotificacoesGerais();

      return res.status(201).json({ notificacoes });
    } catch (err) {
      next(err);
    }
  }

  static async buscarNotificacoesParticulares(req, res, next) {
    try {
      const usuarioId = req.user?.id;

      const notificacoes =
        await NotificacoesService.buscarNotificacoesParticulares(usuarioId);

      return res.status(201).json({ notificacoes });
    } catch (err) {
      next(err);
    }
  }

  static async deletarNotificacao(req, res, next) {
    try {
      const notificacaoId = req.params.id;

      const notificacaoDeletada = await NotificacoesController(notificacaoId);

      return res.status(201).json({ notificacaoDeletada });
    } catch (err) {
      next(err);
    }
  }

  static async limparNotificacoesAntigas(req, res, next) {
    try {
      const usuarioId = req.user?.id;
      const dias = req.body;

      const notificacoes =
        await NotificacoesController.limparNotificacoesAntigas(usuarioId, dias);

      return res.status(201).json({ notificacoes });
    } catch (err) {
      next(err);
    }
  }

  static async alterarStatusLido(req, res, next) {
    try {
      const notificacaoId = req.params.id;
      const usuarioId = req.user?.id;

      const status = await NotificacoesController.alterarStatusLido(
        notificacaoId,
        usuarioId,
      );

      return res.status(201).json({ status });
    } catch (err) {
      next(err);
    }
  }

  static async buscarFeedUsuario(req, res, next) {
    try {
      const usuarioId = req.user?.id;

      const feed = await NotificacoesController.buscarFeedUsuario(usuarioId);

      return res.status(201).json({ feed });
    } catch (err) {
      next(err);
    }
  }
}
