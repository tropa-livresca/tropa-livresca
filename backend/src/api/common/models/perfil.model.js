import { supabaseAdmin } from "../config/supabase.js";

export class PerfilModel {
  static async buscarPerfil(id) {
    const response = await supabaseAdmin
      .from("users_profile")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!response) return null;
    if (response.error) throw response.error;

    return response.data;
  }

  static async atualizarPerfil(userId, dadosPerfil) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .update(dadosPerfil)
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async atualizarApenasImagem(userId, urlImagem) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .update({ imagem: urlImagem })
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      const erroRegistro = new Error("Nenhum perfil foi encontrado para atualização.");
      erroRegistro.statusCode = 404;
      throw erroRegistro;
    }

    return data;
  }
}
