import { NotificacaoModel } from "../../common/models/notificacao.model.js";
import { error, errorUsuarioId } from "../../common/utils/error.js";
export class NotificacoesService {
  static async enviarNotificacao(titulo, texto, tipo, metadados, usuarioId) {
    if (!usuarioId) errorUsuarioId();

    if (!titulo || !texto || !tipo || !metadados)
      error(400, "Informações da notificação não informados.");

    const dadosEnviados = {
      titulo,
      texto,
      tipo,
      ADM: false,
      geral: false,
      metadados,
      fk_user_profile_id: usuarioId,
    };

    const notificacaoEnviada =
      await NotificacaoModel.enviarNotificacao(dadosEnviados);

    if (notificacaoEnviada.error) throw notificacaoEnviada.error;

    return notificacaoEnviada;
  }

  static async alterarNotificacao(
    titulo,
    texto,
    tipo,
    metadados,
    usuarioId,
    notificacaoId,
  ) {
    if (!usuarioId) errorUsuarioId();

    if (!notificacaoId) error(400, "Id da notificação não informada.");

    const dadosAtualizados = {
      titulo: titulo || "",
      texto: texto || "",
      tipo: tipo || "",
      metadados: metadados || "",
    };

    const notificacaoAlterada = await NotificacaoModel.alterarNotificacao(
      dadosAtualizados,
      usuarioId,
      notificacaoId,
    );

    if (notificacaoAlterada.error) throw notificacaoAlterada.error;

    return notificacaoAlterada;
  }

  static async buscarNotificacao(notificacaoId) {
    if (!notificacaoId) errorUsuarioId();

    const notificacao = await NotificacaoModel.buscarNotificacao(notificacaoId);

    if (notificacao.error) throw notificacao.error;

    return notificacao;
  }

  static async buscarNotificacoesGerais() {
    const notificacoes = await NotificacaoModel.buscarNotificacoesGerais();

    if (notificacoes.error) throw notificacoes.error;

    return notificacoes;
  }

  static async buscarNotificacoesParticulares(usuarioId) {
    if (!usuarioId) errorUsuarioId();

    const notificacoesParticulares =
      await NotificacaoModel.buscarNotificacoesParticulares(usuarioId);

    if (notificacoesParticulares.error) throw notificacoesParticulares.error;

    return notificacoesParticulares;
  }

  static async deletarNotificacao(notificacaoId) {
    if (!notificacaoId)
      errorUsuarioId(500, "Id da notificação para deletar não informado.");

    const notificacaoDeletado =
      await NotificacaoModel.deletarNotificacao(notificacaoId);

    if (notificacaoDeletado.error) throw notificacaoDeletado.error;

    return notificacaoDeletado;
  }

  static async limparNotificacoesAntigas(usuarioId, dias) {
    if (!usuarioId) errorUsuarioId();

    if (!dias) error(400, "Número de dias não informados.");

    const notificacoesLimpas = await NotificacaoModel.limparNotificacoesAntigas(
      usuarioId,
      dias,
    );

    if (notificacoesLimpas.error) throw notificacoesLimpas.error;

    return notificacoesLimpas;
  }

  static async alterarStatusLido(notificacaoId, usuarioId) {
    if (!usuarioId) errorUsuarioId();

    if (!notificacaoId) error(400, "Id da notificação não informado.");

    const status = await NotificacaoModel.alterarStatusLido(
      notificacaoId,
      usuarioId,
    );

    if (status.error) throw status.error;

    return status;
  }

  static async buscarFeedUsuario(usuarioId) {
    if (!usuarioId) errorUsuarioId();

    const feed = await NotificacaoModel.buscarFeedUsuario(usuarioId);

    if (feed.error) throw feed.error;

    return feed;
  }
}
