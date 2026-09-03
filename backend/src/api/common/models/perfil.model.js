import { supabaseAdmin } from "../config/supabase.js";

export class PerfilModel {

  static async buscarPerfilAdmin({ page = 1, limit = 12, busca = "", ordem = "", funcao= "" }) {

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabaseAdmin
      .from("users_profile")
      .select("*, livros (fk_user_profile_id)", { count: "exact" })

    if (busca) {
      query = query.or(`nome.ilike.%${busca}%`);
    }

    const isAsc = ordem !== "descendente";
    console.log(ordem);
    console.log(isAsc);
    query = query.order("nome", { ascending: isAsc });


    if (funcao === "funcionario") {
      query = query.neq("funcao", "");
    } else if (funcao === "autor") {
      query = supabaseAdmin.from("users_profile")
      .select("*, livros!inner(ativo, estado)", {
        count: "exact",
      })
      .eq("livros.ativo", true)
      .eq("livros.estado", "publicado")
    }else if (funcao === "cliente") {
      query = query.eq("is_admin", "FALSE");
    } 

    const { data, error, count } = await query.range(start, end);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data: data || [],
      count: count || 0,
    };


    /*

    const response = await supabaseAdmin
      .from("users_profile")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!response) return null;
    if (response.error) throw response.error;

    return response.data;

    */
  }

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
