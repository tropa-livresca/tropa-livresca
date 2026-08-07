import supabase from "../config/supabase.js";

export class AutorModel {
  static async buscarComFiltros({ page = 1, limit = 12, busca = "" }) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let queryId = supabase
      .from("users_profile")
      .select("id, livros!inner(ativo, estado)", {
        count: "exact",
        head: false,
      })
      .eq("livros.ativo", true)
      .eq("livros.estado", "publicado");

    if (busca) {
      queryId = queryId.ilike("nome", `%${busca}%`);
    }

    const {
      data: autoresIds,
      error: errorIds,
      count,
    } = await queryId.order("nome", { ascending: true }).range(start, end);

    if (errorIds) {
      errorIds.statusCode = 500;
      throw errorIds;
    }

    if (!autoresIds || autoresIds.length === 0) {
      return { data: [], count: 0 };
    }

    const idsParaBuscar = autoresIds.map((autor) => autor.id);

    const { data, error } = await supabase
      .from("users_profile")
      .select(
        "nome, telefone, imagem, descricao, livros(id, titulo, ativo, capa, preco_digital, preco_fisico, idioma)",
      )
      .in("id", idsParaBuscar)
      .eq("livros.ativo", true)
      .eq("livros.estado", "publicado")
      .order("nome", { ascending: true });

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
