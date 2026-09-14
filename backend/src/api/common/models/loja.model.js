import supabase from "../config/supabase.js";

const COLUNAS_LIVRO = `
  ISBN,
  imagens_explicitas,
  publico_alvo,
  data_de_publicacao,
  preco_digital,
  preco_fisico,
  autor_nome,
  autor_sobrenome,
  idioma,
  titulo,
  subtitulo,
  descricao,
  capa,
  numero_edicao,
  conteudo_por_IA,
  direitos_de_publicacao
`;

export class LojaModel {
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
      .eq("estado", "publicado");

    if (busca) {
      query = query.ilike("titulo", `%${busca}%`);
    }

    if (filtro === "alfabetico") {
      query = query.order("titulo", {
        ascending: ordem !== "descendente",
      });
    } else if (filtro === "data") {
      query = query.order("data_de_publicacao", {
        ascending: ordem === "ascendente",
      });
    } else {
      query = query.order("titulo", {
        ascending: true,
      });
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

  static async buscarLivroById(id) {
    const { data, error } = await supabase
      .from("livros")
      .select(COLUNAS_LIVRO)
      .eq("id", id)
      .eq("ativo", true)
      .eq("estado", "publicado")
      .single();

    if (error) {
      error.statusCode = 404;
      throw error;
    }

    return data;
  }
}
