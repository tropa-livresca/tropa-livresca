import supabase from "../config/supabase.js";

export class AutorModel {
  static async buscarComFiltros({ page = 1, limit = 12, busca = ""}) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from("users_profile")
      .select("nome, telefone, imagem, descricao, livros!inner(id, titulo, ativo, capa, preco_digital, preco_fisico, idioma)", { count: "exact" })
      .eq("livros.ativo", true)
      .eq("livros.estado", "publicado");
    
    if (busca) {
      query = query.ilike("nome", `%${busca}%`);
    }

    const { data, error, count } = await query
      .order("nome", { ascending: true })
      .range(start, end);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return { data: data || [], count: count || 0 };
  }

  static async buscarPorId(id) {
    const { data, error } = await supabase
      .from("users_profile")
      .select("id, nome, imagem, descricao, redes_sociais")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }
    return data;
  }
}
