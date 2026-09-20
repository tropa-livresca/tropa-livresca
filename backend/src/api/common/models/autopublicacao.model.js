import supabase, { supabaseAdmin } from "../config/supabase.js";

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

    if (estado === "publicado") {
      query = query.eq("estado", "publicado");
    }

    if (estado === "em_revisao") {
      query = query.eq("estado", "em_revisao");
    }

    if (estado === "rascunho") {
      query = query.eq("estado", "rascunho");
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

  static async atualizarEstado(id, novoEstado, userId) {
    const { data: livroAtual, error: fetchError } = await supabaseAdmin
      .from("livros")
      .select("estado")
      .eq("id", id)
      .eq("fk_user_profile_id", userId)
      .eq("ativo", true)
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

    const { data, error: updateError } = await supabaseAdmin
      .from("livros")
      .update({ estado: novoEstado })
      .eq("id", id)
      .eq("fk_user_profile_id", userId)
      .eq("ativo", true)
      .select()
      .single();

    if (updateError) {
      updateError.statusCode = 500;
      throw updateError;
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

  static async atualizarLivro(id, dadosAtualizados) {
    const { data, error } = await supabaseAdmin
      .from("livros")
      .update(dadosAtualizados)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
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

    if (livroAtual.estado !== "rascunho") {
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
      .select();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }
}
