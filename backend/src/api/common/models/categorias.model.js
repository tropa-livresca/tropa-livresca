import supabase, {supabaseAdmin} from "../config/supabase.js";

export class CategoriasModel {
  static async CriarCategoria(dadosCategoria) {
    const { data, error } = await supabaseAdmin
      .from("categorias")
      .insert(dadosCategoria)
      .select()
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async InativarCategoria(id) {
    const { data, error } = await supabase
      .from("categorias")
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

  static async AlterarCategoria(id, dadosAtualizados) {
    const { data, error } = await supabase
      .from("categorias")
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

  static async BuscarCategorias(page = 1, limit = 12, busca = "", filtro = "", ordem = "", tipo = "") {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from("categorias")
      .select("*", { count: "exact" })
      .eq("ativo", true);

    if (tipo) {
      query = query.eq("tipo", tipo);
    }

    if (busca) {
      query = query.ilike("nome", `%${busca}%`);
    }

    const isAsc = ordem === "ascendente" || ordem !== "descendente";

    if (filtro === "data") {
      query = query.order("data_criacao", { ascending: isAsc });
    } else {
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

  static async BuscarCategoriaById(id) {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }
}
