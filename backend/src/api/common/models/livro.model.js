import { supabaseAdmin } from "../config/supabase.js";

export class LivroModel {
  static async buscarComFiltros({ page = 1, limit = 12, busca = "", apenasAtivos = true }) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabaseAdmin
      .from("livros")
      .select("*", { count: "exact" });

    if (apenasAtivos) {
      query = query.eq("ativo", true);
    }

    if (busca) {
      query = query.ilike("titulo", `%${busca}%`);
    }

    const { data, error, count } = await query
      .order("titulo", { ascending: true })
      .range(start, end);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return { data: data || [], count: count || 0 };
  }

  static async buscarPorPerfilUsuario(userId) {
    const { data, error } = await supabaseAdmin
      .from("livros")
      .select("*")
      .eq("fk_user_profile_id", userId)
      .eq("ativo", true);

    if (error) {
      error.statusCode = 500;
      throw error;
    }
    
    return data || []; 
  }

  static async buscarDetalhesPorId(id) {
    const { data, error } = await supabaseAdmin
      .from("livros")
      .select("*, users_profile(id, nome, imagem)")
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
