import supabase, { supabaseAdmin } from "../config/supabase.js";

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

    let query = supabaseAdmin.from("users_profile");

    if (filtro === "funcionario") {
      query = query
        .select("*, livros(estado, ativo)", { count: "exact" })
        .eq("is_admin", true);
    } else if (filtro === "autor") {
      query = query
        .select("*, livros!inner(estado, ativo)", { count: "exact" })
        .eq("livros.estado", "publicado")
        .eq("livros.ativo", true);
    } else {
      query = query.select("*, livros(estado, ativo)", { count: "exact" });
    }

    if (busca) {
      query = query.ilike("nome", `%${busca}%`);
    }

    const isAsc = ordem !== "descendente";
    query = query.order("nome", { ascending: isAsc });

    let { data, error, count } = await query.range(start, end);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    const usuariosFormatados =
      data?.map((usuario) => {
        const temLivroPublicado =
          Array.isArray(usuario.livros) &&
          usuario.livros.some(
            (livro) => livro.estado === "publicado" && livro.ativo === true,
          );

        const { ...dadosDoUsuario } = usuario;

        return {
          ...dadosDoUsuario,
          isFuncionario: {
            isAdmin: !!usuario.is_admin,
            primeiro_acesso: usuario.primeiro_acesso,
          },
          isAutor: temLivroPublicado,
        };
      }) || [];

    return {
      data: usuariosFormatados,
      count: count || 0,
    };
  }
}
