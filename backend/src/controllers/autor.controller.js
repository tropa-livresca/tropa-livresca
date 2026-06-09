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
      data: autoresUnicos,
      meta: {
        page,
        limit,
        localItems: autoresUnicos.length,
        totalItems: totalItens,
        totalPage: Math.ceil(totalItens / limit),
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
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .select(
        "id, nome, telefone, imagem, descricao, usu_redes(url, plataforma), livros!fk_user_profile_id(id,data_de_publicacao, titulo, subtitulo, capa)",
      )
      .eq("id", id)
      .maybeSingle()
      .range(start, end);

    if (error) {
      console.error("Erro no supabase", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "Autor não encontrado" });
    }

    return res.status(200).json({
      data,
      meta: {
        page,
        limit,
        localItems: autoresUnicos.length,
        totalItems: totalItens,
        totalPage: Math.ceil(totalItens / limit),
      },
    });
  } catch (err) {
    console.error("Erro inesperado", err);
    return res.status(500).json({ error: "Erro inesperado" });
  }
};
