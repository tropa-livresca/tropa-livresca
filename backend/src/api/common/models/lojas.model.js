import supabase, {supabaseAdmin} from "../config/supabase";

const COLUNAS_LIVRO = "ISBN, imagens_explicitas, publico_alvo, data_de_publicacao, preco_digital, preco_fisico, autor_nome, autor_sobrenome, idioma, titulo, subtitulo, descricao, capa, numero_edicao, conteudo_por_IA, direitos_de_publicacao";

export class LojasModel{
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
          const isAsc = ordem !== "descendente";
          query = query.order("titulo", { ascending: isAsc });
        } else if (filtro === "data") {
          const isAsc = ordem === "ascendente";
          query = query.order("data_de_publicacao", { ascending: isAsc });
        } else {
          query = query.order("titulo", { ascending: true });
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
    
    static async BuscarLivroLojaById(){}
}