import { supabaseAdmin } from "../config/supabase.js";

export class AvaliacaoModel {
  static async buscarResumoLivro(livroId) {
    const { data, error } = await supabaseAdmin
      .from("avaliacoes")
      .select("qtd_estrelas")
      .eq("fk_livros_id", livroId);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    const total = data?.length || 0;
    if (total === 0) return { media: 0, total: 0 };

    const soma = data.reduce((acc, item) => acc + (item.qtd_estrelas || 0), 0);

    return { media: Math.round((soma / total) * 10) / 10, total };
  }

  static async buscarAvaliacaoUsuario(usuarioId, livroId) {
    const { data, error } = await supabaseAdmin
      .from("avaliacoes")
      .select("id, qtd_estrelas")
      .eq("fk_livros_id", livroId)
      .eq("fk_users_profile_id", usuarioId)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async usuarioComprouLivro(usuarioId, livroId) {
    const { data, error } = await supabaseAdmin
      .from("itens_venda")
      .select("id, vendas!inner(fk_user_profile_id, status_pagamento)")
      .eq("fk_livros_itens_id", livroId)
      .eq("vendas.fk_user_profile_id", usuarioId)
      .eq("vendas.status_pagamento", "pago")
      .limit(1);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data.length > 0;
  }

  // Cada usuário tem no máximo uma avaliação por livro: atualiza se já existir.
  static async salvarAvaliacao(usuarioId, livroId, qtdEstrelas) {
    const existente = await this.buscarAvaliacaoUsuario(usuarioId, livroId);

    const query = existente
      ? supabaseAdmin
          .from("avaliacoes")
          .update({ qtd_estrelas: qtdEstrelas })
          .eq("id", existente.id)
      : supabaseAdmin.from("avaliacoes").insert({
          fk_livros_id: livroId,
          fk_users_profile_id: usuarioId,
          qtd_estrelas: qtdEstrelas,
        });

    const { data, error } = await query.select("id, qtd_estrelas").single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }
}
