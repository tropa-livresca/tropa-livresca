import { supabaseAdmin } from "../config/supabase.js";

export class AutorModel {
  static async buscarComFiltros({ page = 1, limit = 12, busca = "", apenasComLivrosAtivos = true }) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const camposSelect = apenasComLivrosAtivos
      ? "id, nome, imagem, descricao, livros!inner(id)"
      : "id, nome, telefone, imagem, descricao, criado_em, livros(id, titulo, ativo, capa, preco_digital, preco_fisico, idioma)";

    let query = supabaseAdmin
      .from("users_profile")
      .select(camposSelect, { count: "exact" })
      .order("nome", { ascending: true });

    if (apenasComLivrosAtivos) {
      query = query.eq("livros.ativo", true);
    }

    if (busca) {
      query = query.ilike("nome", `%${busca}%`);
    }

    const { data, error, count } = await query.range(start, end);
    if (error) throw error;

    return { data: data || [], count: count || 0 };
  }

  static async buscarPorId(id) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .select("id, nome, imagem, descricao, redes_sociais")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};
