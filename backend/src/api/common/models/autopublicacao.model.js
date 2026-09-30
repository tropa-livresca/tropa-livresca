import supabase, { supabaseAdmin } from "../config/supabase.js";
import { LIVRO_ESTADO } from "../config/livro-estados.js";

export class AutopublicacaoModel {
  static async buscarComFiltros({
    userId,
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
    estado = "",
  } = {}) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from("livros")
      .select("*", { count: "exact" })
      .eq("ativo", true)
      .eq("fk_user_profile_id", userId);

    if (busca) {
      query = query.ilike("titulo", `%${busca}%`);
    }

    if (filtro === "alfabetico") {
      const isAsc = ordem !== "descendente";
      query = query.order("titulo", { ascending: isAsc });
    } else if (filtro === "data") {
      const isAsc = ordem === "ascendente";
      query = query.order("data_de_publicacao", { ascending: isAsc });
    } else {
      query = query.order("titulo", { ascending: true });
    }

    if (Object.values(LIVRO_ESTADO).includes(estado)) {
      query = query.eq("estado", estado);
    }

    const { data, error, count } = await query.range(start, end);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data,
      count: count || 0,
    };
  }

  static async buscarDetalhesPorId(idLivro, userId) {
    const { data, error } = await supabaseAdmin
      .from("livros")
      .select("*")
      .eq("id", idLivro)
      .eq("fk_user_profile_id", userId)
      .eq("ativo", true)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async atualizarEstado(id, novoEstado, userId, estadoAtual) {
    let query = supabaseAdmin
      .from("livros")
      .update({ estado: novoEstado })
      .eq("id", id)
      .eq("fk_user_profile_id", userId)
      .eq("ativo", true);

    if (estadoAtual) {
      query = query.eq("estado", estadoAtual);
    }

    const { data, error: updateError } = await query.select().maybeSingle();

    if (updateError) {
      updateError.statusCode = 500;
      throw updateError;
    }

    if (!data) {
      const error = new Error("Livro não encontrado ou estado desatualizado.");
      error.statusCode = 409;
      throw error;
    }

    return data;
  }

  static async criarLivro(dadosLivro) {
    const { data, error } = await supabaseAdmin
      .from("livros")
      .insert(dadosLivro)
      .select()
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }
    return data;
  }

  static async atualizarLivro(id, userId, estadoAtual, dadosAtualizados) {
    const { data, error } = await supabaseAdmin
      .from("livros")
      .update(dadosAtualizados)
      .eq("id", id)
      .eq("fk_user_profile_id", userId)
      .eq("ativo", true)
      .eq("estado", estadoAtual)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!data) {
      const updateError = new Error(
        "Livro não encontrado ou estado desatualizado.",
      );
      updateError.statusCode = 409;
      throw updateError;
    }

    return data;
  }

  static async deletarLivro(idLivro, userId) {
    const { data: livroAtual, error: fetchError } = await supabaseAdmin
      .from("livros")
      .select("estado")
      .eq("id", idLivro)
      .eq("fk_user_profile_id", userId)
      .maybeSingle();

    if (fetchError) {
      fetchError.statusCode = 500;
      throw fetchError;
    }

    if (!livroAtual) {
      const error = new Error("Livro não encontrado.");
      error.statusCode = 404;
      throw error;
    }

    if (livroAtual.estado !== LIVRO_ESTADO.RASCUNHO) {
      const erroEstado = new Error(
        "Livros em rascunho podem ser deletados. Livros em revisão ou publicados não podem ser deletados.",
      );
      erroEstado.statusCode = 400;
      throw erroEstado;
    }

    const { data, error } = await supabaseAdmin
      .from("livros")
      .delete()
      .eq("id", idLivro)
      .eq("fk_user_profile_id", userId)
      .eq("ativo", true)
      .eq("estado", LIVRO_ESTADO.RASCUNHO)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!data) {
      const deleteError = new Error("Livro não encontrado ou já foi removido.");
      deleteError.statusCode = 409;
      throw deleteError;
    }

    return data;
  }
}
