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
      .select("id, nome, telefone, imagem, descricao, livros!inner(id)")
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

    return res.json({
      data,
      meta: {
        page,
        limit,
        localItems: count,
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
  try {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .select(
        "id, nome, telefone, imagem, descricao, usu_redes(url, plataforma)",
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Erro no supabase", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "Autor não encontrado" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro inesperado", err);
    return res.status(500).json({ error: "Erro inesperado" });
  }
};
