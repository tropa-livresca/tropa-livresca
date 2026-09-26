import supabase from "../config/supabase.js";

export class NotificacaoModel {
  static async enviarNotificacao(dadosNotificacao) {
    const { data, error } = await supabase
      .from("notificacoes")
      .insert(dadosNotificacao)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async buscarNotificacao(notificacaoId) {
    const { data, error } = await supabase
      .from("notificacoes")
      .select("*")
      .eq("id", notificacaoId)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async buscarNotificacoesGerais() {
    const { data, error } = await supabase
      .from("notificacoes")
      .select("*")
      .eq("geral", true);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async buscarNotificacoesParticulares(usuarioId) {
    const { data, error } = await supabase
      .from("notificacoes")
      .select("*")
      .eq("fk_user_profile_id", usuarioId);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async deletarNotificacao(notificacaoId) {
    const { data: notificacaoData, error: fetchError } = await supabase
      .from("notificacoes")
      .select("geral")
      .eq("id", notificacaoId)
      .maybeSingle();

    if (fetchError || !notificacaoData) {
      const erro = new Error("Notificação não encontrada.");
      erro.statusCode = 404;
      throw erro;
    }

    if (notificacaoData.geral) {
      const erroNotificacao = new Error(
        "Não é possível deletar notificações gerais.",
      );
      erroNotificacao.statusCode = 400;
      throw erroNotificacao;
    }

    const { data, error } = await supabase
      .from("notificacoes")
      .delete()
      .eq("id", notificacaoId)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async limparNotificacoesAntigas(usuarioId, dias) {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    const { data, error } = await supabase
      .from("notificacoes")
      .delete()
      .eq("fk_user_profile_id", usuarioId)
      .lt("data", dataLimite.toISOString())
      .select();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async alterarStatusLido(notificacaoId, usuarioId) {
    const { data, error } = await supabase
      .from("notificacoes_lidas")
      .upsert(
        {
          fk_notificacao_id: notificacaoId,
          fk_user_profile_id: usuarioId,
        },
        { onConflict: "fk_notificacao_id,fk_user_profile_id" },
      )
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async buscarFeedUsuario(usuarioId) {
    const { data, error } = await supabase
      .from("notificacoes")
      .select(
        `
        *,
        notificacoes_lidas (
          id
        )
      `,
      )
      .eq("notificacoes_lidas.fk_user_profile_id", usuarioId)
      .or(`geral.eq.true,fk_user_profile_id.eq.${usuarioId}`)
      .order("data", { ascending: false });

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    const feedFormatado = data.map((notificacao) => {
      const lida =
        notificacao.notificacoes_lidas &&
        notificacao.notificacoes_lidas.length > 0;

      const { notificacoes_lidas, ...dadosNotificacao } = notificacao;

      return {
        ...dadosNotificacao,
        lida: lida,
      };
    });

    return feedFormatado;
  }
}
