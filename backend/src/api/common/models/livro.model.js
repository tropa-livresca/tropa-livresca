import { supabaseAdmin } from "../config/supabase.js";

export const LivroModel = {
  async buscarComFiltros({ page = 1, limit = 12, busca = "", apenasAtivos = true }) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabaseAdmin
      .from("livros")
      .select("*", { count: "exact" })
      .order("titulo", { ascending: true });

    if (apenasAtivos) {
      query = query.eq("ativo", true);
    }

    if (busca) {
      query = query.ilike("titulo", `%${busca}%`);
    }

    const { data, error, count } = await query.range(start, end);
    if (error) throw error;

    return { data: data || [], count: count || 0 };
  },

  async buscarPorPerfilUsuario(userId) {
    let query = supabaseAdmin
      .from("livros")
      .select("*")
      .eq("fk_user_profile_id", userId)
      .eq("ativo", true);

    const { data, error } = await query;
    if (error) throw error;
    
    return { data: data || [] };
  },

  async buscarDetalhesPorId(id) {
    let query = supabaseAdmin
      .from("livros")
      .select("*, users_profile(id, nome, imagem)")
      .eq("id", id)
      .eq("ativo", true);

    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data;
  },

};
