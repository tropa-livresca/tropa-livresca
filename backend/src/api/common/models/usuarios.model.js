import { supabaseAdmin } from "../config/supabase.js";

export class UsuariosModel {
  static async buscarUsuarios({
    page = 1,
    limit = 12,
    busca = "",
    ordem = "",
    filtro = "",
  }) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabaseAdmin
      .from("users_profile")
      .select("*, livros(estado, ativo)", { count: "exact" });

    if (filtro === "funcionario") {
      query = query.eq("is_admin", true);
    } else if (filtro === "cliente") {
      query = query.eq("is_admin", false);
    }

    if (busca) {
      query = query.ilike("nome", `%${busca}%`);
    }

    const isAsc = ordem === "ascendente";
    query = query.order("nome", { ascending: isAsc });

    let { data, error, count } = await query;

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    let usuariosFormatados =
      data?.map((usuario) => {
        const temLivroPublicado =
          Array.isArray(usuario.livros) &&
          usuario.livros.some(
            (livro) => livro.estado === "publicado" && livro.ativo === true,
          );

        return {
          id: usuario.id,
          nome: usuario.nome,
          isAdmin: !!usuario.is_admin,
          isAutor: temLivroPublicado,
          redes_sociais: usuario.redes_sociais,
          primeiro_acesso: usuario.primeiro_acesso,
        };
      }) || [];

    if (filtro === "autor") {
      usuariosFormatados = usuariosFormatados.filter((u) => u.isAutor);
      count = usuariosFormatados.length;
    }

    const dadosPaginados = usuariosFormatados.slice(start, end + 1);

    return {
      data: dadosPaginados,
      count: count || 0,
    };
  }

  static async buscarUsuarioById(usuarioId) {
    if (!usuarioId) return null;

    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .select("*, livros(*), revisoes(*)")
      .eq("id", usuarioId)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
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
