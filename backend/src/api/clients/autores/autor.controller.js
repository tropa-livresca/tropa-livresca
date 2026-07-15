import { supabaseAdmin } from "../../../common/config/supabase.js";

export const GetAutores = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const busca = req.query.busca || "";

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabaseAdmin
      .from("users_profile")
      .select("id, nome, imagem, descricao, livros!inner(id)", {
        count: "exact",
      })
      .eq("livros.ativo", true)
      .order("nome", { ascending: true });

    if (busca) {
      query = query.ilike("nome", `%${busca}%`);
    }

    const { data, error, count } = await query.range(start, end);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!data || data.length === 0) {
      const erro404 = new Error("Nenhum autor foi encontrado no catálogo.");
      erro404.statusCode = 404;
      throw erro404;
    }

    return res.json({
      data,
      meta: {
        page,
        limit,
        totalItems: count,
        totalPage: Math.ceil(count / limit),
      },
    });

  } catch (err) {
    next(err);
  }
};

export const GetAutorById = async (req, res, next) => {
  const { id } = req.params;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  try {
    const { data: autor, error: autorError } = await supabaseAdmin
      .from("users_profile")
      .select(
        "id, nome, imagem, descricao, usu_redes(url, plataforma)",
      )
      .eq("id", id)
      .maybeSingle();
      
    if (autorError) {
      autorError.statusCode = 500;
      throw autorError;
    }

    if (!autor) {
      const erro404 = new Error("O autor solicitado não foi encontrado.");
      erro404.statusCode = 404;
      throw erro404;
    }

    const { data: livros, error: livrosError, count } = await supabaseAdmin
      .from("livros")
      .select("id, data_de_publicacao, titulo, subtitulo, capa", { count: "exact" })
      .eq("fk_user_profile_id", id)
      .eq("ativo", true)
      .order("data_de_publicacao", { ascending: false })
      .range(start, end);

    if (livrosError) {
      livrosError.statusCode = 500;
      throw livrosError;
    }

    return res.status(200).json({
      data: {
        ...autor,
        livros: livros || []
      },
      meta: {
        page,
        limit,
        totalItems: count,
        totalPage: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};
