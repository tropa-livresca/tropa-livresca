import supabase, { supabaseAdmin } from "../config/supabase.js";

export class EnderecoModel {
  static async BuscarEnderecos(userId) {
    const { data, error } = await supabaseAdmin
      .from("enderecos")
      .select("*")
      .eq("fk_user_profile_id", userId)
      .eq("ativo", true);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return { data };
  }

  static async BuscarEnderecoPrincipal(userId){
    const {data, error} = await supabaseAdmin
    .from("enderecos")
    .select("*")
    .eq("fk_user_profile_id", userId)
    .eq("principal", true)
    .eq("ativo", true)
    .maybeSingle();

    if(error){
      error.statusCode = 500;
      throw error;
    }

    return {data};
  }

  static async BuscarEnderecoById(id, userId) {
    const { data, error } = await supabaseAdmin
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

    return { data };
  }

  static async AtualizarEnderecoById(id, dadosAtualizados, userId) {
    const { data, error } = await supabaseAdmin
      .from("enderecos")
      .update(dadosAtualizados)
      .eq("id", id)
      .eq("fk_user_profile_id", userId)
      .select()
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return { data };
  }

  static async InativarEndereco(id, userId) {
    const { data, error } = await supabaseAdmin
      .from("enderecos")
      .update({ ativo: false })
      .eq("id", id)
      .eq("fk_user_profile_id", userId)
      .select()
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return { data };
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

    return { data };
  }

  static async DefinirPrincipal(id, userId) {
    const { data, error } = await supabaseAdmin
      .from("enderecos")
      .update({ principal: true })
      .eq("id", id)
      .eq("fk_user_profile_id", userId)
      .select()
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return { data };
  }
}
