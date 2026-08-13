import supabase from "../config/supabase.js";

export class RevisaoModel {
  static async BuscarRevisoes({
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
  }) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from("revisoes")
      .select("*", { count: "exact" })
      .eq("ativo", true);

    if (busca) {
      query = query.or(`nome.ilike.%${busca}%`);
    }

    if (filtro === "data") {
      const isAsc = ordem === "ascendente";
      query = query.order("data_de_criacao", { ascending: isAsc });
    } else {
      const isAsc = ordem !== "descendente";
      query = query.order("nome", { ascending: isAsc });
    }

    const { data, error, count } = await query.range(start, end);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data: data || [],
      count: count || 0,
    };
  }

  static async BuscarRevisaoById(id) {
    const { data, error } = await supabase
      .from("revisoes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async AtualizarRevisao(id, dadosAtualizados) {
    const { data, error } = await supabase
      .from("revisoes")
      .update(dadosAtualizados)
      .select()
      .eq("id", id)
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async CriarRevisao(dadosRevisao) {
    const { data, error } = await supabase
      .from("revisoes")
      .insert(dadosRevisao)
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async ExcluirRevisao(id) {
    const { data, error } = await supabase
      .from("revisoes")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async AlterarEstadoLivro(idLivro, novoEstado) {
    const { data, error } = await supabase
      .from("livros")
      .update("estado", novoEstado)
      .eq("id", idLivro)
      .select()
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }
}
