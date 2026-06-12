import supabase, { supabaseAdmin } from "../config/supabase.js";

export const GetAutores = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const busca = req.query.busca || "";

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabaseAdmin
      .from("users_profile")
      .select("id, nome, telefone, imagem, descricao, livros!inner(id)", {
        count: "exact",
      })
      .eq("livros.ativo", true)
      .order("nome", { ascending: true });

    if (busca) {
      query = query.ilike("nome", `%${busca}%`);
    }

    const { data, error, count } = await query.range(start, end);

    if (error) {
      console.error("Erro no supabase", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "Nenhum autor encontrado" });
    }

    const autoresUnicos = data.filter(
      (autor, index, self) =>
        self.findIndex((a) => a.id === autor.id) === index,
    );

    const totalItens = count || autoresUnicos.length;

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
    console.error("Erro inesperado", err);
    return res.status(500).json({ error: "Erro inesperado" });
  }
};

export const GetAutorById = async (req, res) => {
  const { id } = req.params;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  try {
    const { data: autor, error: autorError } = await supabaseAdmin
      .from("users_profile")
      .select(
        "id, nome, telefone, imagem, descricao, usu_redes(url, plataforma)",
      )
      .eq("id", id)
      .maybeSingle()
      
    if (autorError) {
      console.error("Erro no supabase", autorError);
      return res.status(500).json({ autorError: error.message });
    }

    if (!autor) {
      return res.status(404).json({ autorError: "Autor não encontrado" });
    }

 const { data: livros, error: livrosError, count } = await supabaseAdmin
      .from("livros")
      .select("id, data_de_publicacao, titulo, subtitulo, capa", { count: "exact" })
      .eq("fk_user_profile_id", id)
      .eq("ativo", true)
      .order("data_de_publicacao", { ascending: false })
      .range(start, end);

    if (livrosError) {
      console.error("Erro ao buscar livros", livrosError);
      return res.status(500).json({ error: livrosError.message });
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
    console.error("Erro inesperado", err);
    return res.status(500).json({ error: "Erro inesperado" });
  }
};
