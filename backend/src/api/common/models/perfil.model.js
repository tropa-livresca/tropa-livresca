import { supabaseAdmin } from "../config/supabase.js";

export class PerfilModel {
  static async buscarPorId(id) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  static async salvar(dados) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .upsert(dados, { onConflict: "id" })
      .select()
      .maybeSingle();

    if (error) throw error;

    return data;
  }
};
