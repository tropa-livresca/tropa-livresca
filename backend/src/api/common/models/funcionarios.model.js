import supabase, { supabaseAdmin } from "../config/supabase.js";

export class FuncionariosModel {
  static async buscarFuncionarios({
    page = 1,
    limit = 12,
    busca = "",
    ordem = "",
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

  static async alterarFuncao(usuarioId, funcao) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .update({ funcao: funcao, is_admin: funcao == "funcionario" })
      .eq("id", usuarioId)
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

  static async inativarFuncionario(funcionarioId) {
    const { data, error } = await supabase
      .from("users_profile")
      .update(false)
      .eq("id", funcionarioId)
      .select("is_admin")
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async buscarFuncionarioById(funcionarioId) {
    const { data, error } = await supabase
      .from("users_profile")
      .select("*")
      .eq("id", funcionarioId)
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    const { data: revisoes, error: revisoesError } = await supabase
      .from("users_profile")
      .select("*")
      .eq("fk_users_profile_id", funcionarioId)
      .maybeSingle();

    if (revisoesError) {
      revisoesError.statusCode = 500;
      throw revisoesError;
    }

    return {
      data,
      revisoes: revisoes,
    };
  }
}
