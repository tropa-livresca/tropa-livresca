import supabase, { supabaseAdmin } from "../config/supabase.js";

export class FuncionariosModel {
  static async buscarFuncionarios({
    page = 1,
    limit = 12,
    busca = "",
    ordem = "",
    filtro = "",
  }) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from("users_profile")
      .select("*", { count: "exact" })
      .eq("is_admin", true);

    if (busca) {
      query = query.ilike("nome", `%${busca}%`);
    }

    if (filtro) {
      query = query.ilike("funcao", `%${filtro}%`);
    }

    const isAsc = ordem !== "descendente";
    query = query.order("nome", { ascending: isAsc });

    const { data, error, count } = await query.range(start, end);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data,
      count: count || 0,
    };
  }

  static async promoverUsuario(usuarioId) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .update({ is_admin: true })
      .select()
      .eq("id", usuarioId)
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async alterarIsMasterFuncionario(funcionarioId, isMaster) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .update({ is_master: isMaster })
      .select()
      .eq("id", funcionarioId)
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async inativarFuncionario(funcionarioId) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .update({
        is_admin: false,
        is_master: false,
      })
      .eq("id", funcionarioId)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      const erroRegistro = new Error(
        "Nenhum perfil foi encontrado para atualização.",
      );
      erroRegistro.statusCode = 404;
      throw erroRegistro;
    }

    return data;
  }
}
