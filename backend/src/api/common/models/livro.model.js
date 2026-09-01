import supabase, {supabaseAdmin} from "../config/supabase.js";

const COLUNAS_LIVRO =
  "ISBN, imagens_explicitas, publico_alvo, data_de_publicacao, autor_nome, autor_sobrenome, idioma, titulo, subtitulo, descricao, capa, numero_edicao, conteudo_por_IA, direitos_de_publicacao";

export class LivroModel {

  //admin
  
  static async buscarLivrosAdmin({ page = 1, limit = 12, busca = "", filtro = "", ordem = "", estado = "" }){
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabaseAdmin
      .from("livros")
      .select("*", { count: "exact" })
      .neq("estado", "rascunho")
      .eq("ativo", true);

    if (busca) {
      query = query.or(`titulo.ilike.%${busca}%,subtitulo.ilike.%${busca}%`);
    }

    if (filtro === "data") {
      const isAsc = ordem !== "descendente";
      query = query.order("data_de_publicacao", { ascending: isAsc });
    } else {
      const isAsc = ordem !== "descendente";
      query = query.order("titulo", { ascending: isAsc });
    }

    if (estado === "publicado") {
      query = query.eq("estado", "publicado");
    } else if (estado === "em_revisao") {
      query = query.eq("estado", "em_revisao");
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

  static async buscarLivroByIdAdmin(livroId){
     if (!livroId) return null;

    const { data, error } = await supabaseAdmin
      .from("livros")
      .select(`*, users_profile(*)`)
      .eq("id", livroId)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  //clients
  static async buscarComFiltros({ page = 1, limit = 12, busca = "", filtro = "", ordem = "" },
  ) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from("livros")
      .select(COLUNAS_LIVRO, { count: "exact" })
      .eq("ativo", true)
      .eq("estado", "publicado");

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

  static async buscarDetalhesPorId(id) {
    if (!id) return null;

    const { data, error } = await supabase
      .from("livros")
      .select(`${COLUNAS_LIVRO}, users_profile(id, nome, imagem)`)
      .eq("id", id)
      .eq("ativo", true)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }
}
