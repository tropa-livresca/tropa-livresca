import supabase, { supabaseAdmin } from "../config/supabase.js";

export const GetLivros = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("livros")
      .select()
      .eq("ativo", true);
    if (error) {
      console.error("Erro ao buscar os livros", error);
      return;
    }

    if (!data) {
      return res.status(404).error("Nenhum livro encontrado", error);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro inesperado", err);
    return res.status(500).json({ error: "Erro inesperado" });
  }
};

export const GetLivrosById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("livros")
      .select("*")
      .eq("fk_user_profile_id", req.user.id)
      .eq("ativo", true);

    if (!req.user.id || !req.user) {
      console.error("Acesso negado: req.user não está definido");
      return res
        .status(401)
        .json({ error: "Usuário não autenticado ou token inválido" });
    }

    if (error) {
      console.error("Erro no supabase", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      console.error("Erro ao buscar livros", error);
      return res.status(404).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("ERRO DO SUPABASE", err);
    return res.status(500).json({ error: error.message });
  }
};
