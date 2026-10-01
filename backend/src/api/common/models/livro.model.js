import supabase, { supabaseAdmin } from "../config/supabase.js";
import { LIVRO_ESTADO } from "../config/livro-estados.js";

const COLUNAS_LIVRO =
  "id, ISBN, imagens_explicitas, data_de_publicacao, autor_nome, autor_sobrenome, idioma, titulo, subtitulo, descricao, capa, numero_edicao, conteudo_por_IA, direitos_de_publicacao";

export class LivroModel {
  //admin

  static async buscarLivrosAdmin({
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
    estado = "",
  }) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabaseAdmin
      .from("livros")
      .select("*", { count: "exact" })
      .neq("estado", LIVRO_ESTADO.RASCUNHO)
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

    if (estado === LIVRO_ESTADO.PUBLICADO) {
      query = query.eq("estado", LIVRO_ESTADO.PUBLICADO);
    } else if (estado === LIVRO_ESTADO.EM_REVISAO) {
      query = query.eq("estado", LIVRO_ESTADO.EM_REVISAO);
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

  static async buscarLivroByIdAdmin(livroId) {
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

  static async alterarAtivoLivro(livroId, ativo) {
    const { data, error } = await supabaseAdmin
      .from("livros")
      .update({ ativo })
      .eq("id", livroId)
      .select("id, titulo, ativo")
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async buscarLivroByUserId(userId) {
    if (!userId) return null;

    const { data, error } = await supabaseAdmin
      .from("livros")
      .select(`*, users_profile(*)`)
      .eq("fk_user_profile_id", userId);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  //clients
  static async buscarComFiltros({
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
  }) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from("livros")
      .select(COLUNAS_LIVRO, { count: "exact" })
      .eq("ativo", true)
      .eq("estado", LIVRO_ESTADO.PUBLICADO);

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
