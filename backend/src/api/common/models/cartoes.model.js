import supabase from "../config/supabase.js";

export class CartoesModel {
  static async adicionarCartao(dadosCartao) {
    const { data, error } = await supabase
      .from("usuarios_cartoes")
      .insert(dadosCartao)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async alterarCartao(cartaoId, dadosAtualizados) {
    const { data, error } = await supabase
      .from("usuarios_cartoes")
      .update(dadosAtualizados)
      .eq("id", cartaoId)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async deletarCartao(cartaoId, usuarioId) {
    const { data, error } = await supabase
      .from("usuarios_cartoes")
      .delete()
      .eq("id", cartaoId)
      .eq("fk_user_profile_id", usuarioId)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!data) {
      const erro = new Error(
        "Cartão não encontrado ou não pertence a este usuário.",
      );
      erro.statusCode = 404;
      throw erro;
    }

    return data;
  }

  static async buscarCartao(cartaoId) {
    const { data, error } = await supabase
      .from("usuarios_cartoes")
      .select("*")
      .eq("id", cartaoId)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!data) {
      const erro = new Error("Cartão de crédito não localizado.");
      erro.statusCode = 404;
      throw erro;
    }

    return data;
  }

  static async buscarCartoes(usuarioId) {
    const { data, error } = await supabase
      .from("usuarios_cartoes")
      .select("*")
      .eq("fk_user_profile_id", usuarioId);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data || [];
  }
}
