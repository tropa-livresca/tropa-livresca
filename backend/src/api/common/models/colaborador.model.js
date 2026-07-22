import { supabaseAdmin } from "../config/supabase.js";

export class ColaboradorModel {
  static async buscarPorLivroId(livroId) {
    const { data, error } = await supabaseAdmin
      .from("colaboradores")
      .select("nome, sobrenome, funcao")
      .eq("fk_livros_id", livroId)
      .order("nome", { ascending: true });

    if (error) throw error;
    return data || [];
  }
};
