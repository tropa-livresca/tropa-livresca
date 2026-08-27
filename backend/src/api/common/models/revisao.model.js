import supabase, {supabaseAdmin} from "../config/supabase.js";
export class RevisaoModel {
  static async BuscarRevisoes(
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
    livro = "",
  ) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from("revisoes")
      .select("*, livros!inner(id, titulo, subtitulo, capa, autor_nome, autor_sobrenome,fk_user_profile_id, fk_user_profile_id)", { count: "exact" })
      .eq("ativo", true);

    if (busca) {
      query = query.or(`nome.ilike.%${busca}%`);
    }

    if (livro) {
      query = query.eq("fk_livros_id", livro);
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
      return error.message;
    }

    return {
      data: data || [],
      livros: data.livros || [],
      count: count || 0,
    };
  }

  static async BuscarRevisaoById(id, livroId) {
    const { data, error } = await supabase
      .from("revisoes, livros!inner(*)")
      .select("*")
      .eq("id", id)
      .eq("livros.id", livroId)
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data: data,
      livro: data.livros
    };
  }

  static async AtualizarRevisao(id, dadosAtualizados) {
    const { data, error } = await supabase
      .from("revisoes")
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

  static async CriarRevisao(dadosRevisao) {
    const { data, error } = await supabaseAdmin
      .from("revisoes")
      .insert(dadosRevisao)
      .select()
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async InativarRevisao(id) {
    const { data, error } = await supabase
      .from("revisoes")
      .update({ ativo: false })
      .eq("id", id)
      .select()
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
      .update({ estado: novoEstado })
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
