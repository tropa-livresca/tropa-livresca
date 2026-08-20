import supabase from "../config/supabase.js";

const COLUNAS_LIVRO =
  "ISBN, imagens_explicitas, publico_alvo, data_de_publicacao, autor_nome, autor_sobrenome, idioma, titulo, subtitulo, descricao, capa, numero_edicao, conteudo_por_IA, direitos_de_publicacao";

export class LivroModel {
  static async buscarComFiltros(
    { page = 1, limit = 12, busca = "", filtro = "", ordem = "" },
    alguns = true,
  ) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from("livros")
      .select(COLUNAS_LIVRO, { count: "exact" })
      .eq("ativo", true)
      .eq("estado", "publicado");

    if (!alguns) {
      query = supabase.from("livros").select("*", { count: "exact" });
    }

    if (busca) {
      query = query.or(`titulo.ilike.%${busca}%,subtitulo.ilike.%${busca}%`);
    }

    if (filtro === "data") {
      const isAsc = ordem === "ascendente";
      query = query.order("data_de_publicacao", { ascending: isAsc });
    } else {
      const isAsc = ordem !== "descendente";
      query = query.order("titulo", { ascending: isAsc });
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

  static async buscarPorPerfilUsuario(userId) {
    const { data, error } = await supabase
      .from("livros")
      .select(COLUNAS_LIVRO)
      .eq("fk_user_profile_id", userId)
      .eq("ativo", true)
      .eq("estado", "publicado");

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data || [];
  }

  static async buscarDetalhesPorId(id, alguns = true) {
    if (!id) return null;

    let query = await supabase
      .from("livros")
      .select(`${COLUNAS_LIVRO}, users_profile(id, nome, imagem)`)
      .eq("id", id)
      .eq("ativo", true)
      .maybeSingle();

    if (!alguns) {
      query = await supabase
        .from("livros")
        .select(`*, users_profile(id, nome, imagem)`)
        .eq("id", id)
        .maybeSingle();
    }

    const { data, error } = await query;

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }
}
