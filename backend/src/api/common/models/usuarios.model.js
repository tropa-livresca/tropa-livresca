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
    } else if (filtro === "cliente") {
      query = query
        .select("*, livros(estado, ativo)", {
          count: "exact",
        })
        .eq("is_admin", false);
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
      data: data,
      count: count || 0,
    };
  }

  static async buscarUsuarioById(usuarioId) {
<<<<<<< HEAD
    if (!usuarioId) return null;

    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .select(
        `*, livros(estado, ativo, titulo, subtitulo, capa, data_de_publicacao), revisoes(data_criacao ,apontamento ,nome))`,
      )
      .eq("id", usuarioId)
      .maybeSingle();
=======
    const { data, error } = await supabase
      .from("users_profile")
      .select("*")
      .eq("id", usuarioId)
      .single();
>>>>>>> 0f4e28e6ed5fea4f341e4bf88a810accd0361802

    if (error) {
      error.statusCode = 500;
      throw error;
    }

<<<<<<< HEAD
    return data;
=======
    const { data: revisoes, error: revisoesError } = await supabase
      .from("users_profile")
      .select("*")
      .eq("fk_users_profile_id", usuarioId)
      .maybeSingle();

    if (revisoesError) {
      revisoesError.statusCode = 500;
      throw revisoesError;
    }

    return {
      data,
      revisoes: revisoes,
    };
>>>>>>> 0f4e28e6ed5fea4f341e4bf88a810accd0361802
  }
}
