import supabase from "../config/supabase.js";

export class AvaliacaoModel {
  static async criarAvaliacao(usuarioId, livroId, dadosAvaliacao) {
    this.verificarSeUsuarioPodeAvaliar(usuarioId, livroId);

    const { data, error } = await supabase
      .from("avaliacoes")
      .insert(dadosAvaliacao)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async alterarAvaliacao(idUsuario, idAvaliacao, qtd_estrelas) {
    const { data, error } = await supabase
      .from("avaliacoes")
      .update({ qtd_estrelas: qtd_estrelas })
      .eq("id", idAvaliacao)
      .eq("fk_users_profile_id", idUsuario)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async buscarAvaliacoesLivro(idLivro) {
    const { data, error } = await supabase
      .from("avaliacoes")
      .select("qtd_estrelas")
      .eq("fk_livros_id", idLivro);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!data || data.length === 0) {
      return 0;
    }

    const somaEstrelas = data.reduce(
      (acc, curr) => acc + (curr.qtd_estrelas || 0),
      0,
    );
    const media = somaEstrelas / data.length;

    return Math.round(media * 10) / 10;
  }

  static async verificarSeUsuarioPodeAvaliar(usuarioId, livroId) {
    const { data, error } = await supabase
      .from("itens_venda")
      .select(
        `
        id,
        vendas!inner (
          id,
          status_pagamento,
          fk_user_profile_id
        )
      `,
      )
      .eq("fk_livros_itens_id", livroId)
      .eq("vendas.fk_user_profile_id", usuarioId)
      .eq("vendas.status_pagamento", "pago");

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!data || data.length === 0) {
      const erroAvaliacao = new Error(
        "O usuário não pode avaliar este livro pois não possui uma compra aprovada dele.",
      );
      erroAvaliacao.statusCode = 403;
      throw erroAvaliacao;
    }

    return true;
  }
}
