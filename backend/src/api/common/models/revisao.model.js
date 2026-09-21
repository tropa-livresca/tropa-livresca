import supabase, { supabaseAdmin } from "../config/supabase.js";
export class RevisaoModel {
  static async BuscarLivroRevisao(busca) {
    const { data, error } = supabase
      .from("livros")
      .select(
        "id, titulo, subtitulo, capa, autor_nome, autor_sobrenome, estado",
      )
      .ilike("titulo", `%${busca}%`);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

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
      .select(
        "*, livros!inner(id, titulo, subtitulo, capa, autor_nome, autor_sobrenome,fk_user_profile_id, fk_user_profile_id)",
        { count: "exact" },
      );

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

  static async BuscarRevisaoById(id) {
    const { data, error } = await supabase
      .from("revisoes")
      .select("*, livros!inner(*)")
      .eq("id", id)
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data: data,
      livro: data.livros,
    };
  }

  static async BuscarRevisaoByUserId(userId) {
    const { data, error } = await supabase
      .from("revisoes")
      .select(
        "*, livros!inner(id, titulo, subtitulo, capa, autor_nome, autor_sobrenome,fk_user_profile_id, fk_user_profile_id)",
      )
      .eq("fk_user_profile_id", userId);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data: data || [],
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

  static async VerificarAutorLivro(livroId, funcionarioId) {
    const { data, error } = await supabase
      .from("livros")
      .select()
      .eq("id", livroId)
      .eq("fk_user_profile_id", funcionarioId)
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (data) {
      return false;
    }

    return true;
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

  static async publicarLivro(idLivro) {
    const { data, error } = await supabase
      .from("livros")
      .update({ estado: "publicado" })
      .eq("id", idLivro)
      .select()
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async solicitarCorrecaoLivro(idLivro) {
    const { data, error } = await supabase
      .from("livros")
      .update({ estado: "correcao" })
      .eq("id", idLivro)
      .select()
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async negarPublicacaoLivro(idLivro) {
    const { data, error } = await supabase
      .from("livros")
      .update({ estado: "negado" })
      .eq("id", idLivro)
      .select()
      .single();

    if (error) {
      error.statuscode = 500;
      throw error;
    }

    return data;
  }
}
