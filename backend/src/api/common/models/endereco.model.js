import supabase, { supabaseAdmin } from "../config/supabase.js";

export class EnderecoModel {
  static async BuscarEnderecos(userId) {
    const { data, error } = await supabase
      .from("enderecos")
      .select("*")
      .eq("fk_user_profile_id", userId)
      .eq("ativo", true);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async BuscarEnderecoById(id, userId) {
    const { data, error } = await supabase
      .from("enderecos")
      .select()
      .eq("id", id)
      .eq("fk_user_profile_id", userId)
      .eq("ativo", true)
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async AtualizarEnderecoById(id, dadosAtualizados) {
    const { data, error } = await supabase
      .from("enderecos")
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

  static async InativarEndereco(id) {
    const { data, error } = await supabase
      .from("enderecos")
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

  static async CriarEndereco(dadosEndereco) {
    const { data, error } = await supabaseAdmin
      .from("enderecos")
      .insert(dadosEndereco)
      .select()
      .single();

    if (error) {
      error.statusCode = 400;
      throw error;
    }

    return data;
  }
}
