// perfil.model.js
import { supabaseAdmin } from "../config/supabase.js";

export const PerfilModel = {
  async buscarPorId(id) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return data;
  },

  async salvar(dados) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .upsert(dados, { onConflict: "id" })
      .select()
      .maybeSingle();

    if (error) throw error;

    return data;
  },

  async salvarRedes(userId, redes) {
    const redesComUserId = redes.map((rede) => ({
      ...rede,
      fk_user_profile_id: userId,
    }));

    const { error } = await supabaseAdmin
      .from("usu_redes")
      .upsert(redesComUserId, {
        onConflict: "fk_user_profile_id, plataforma",
      });

    if (error) throw error;

    return true;
  },
};