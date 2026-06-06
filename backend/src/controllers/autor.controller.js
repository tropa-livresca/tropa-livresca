import supabase, { supabaseAdmin } from "../config/supabase.js";

export const GetAutores = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .select("id, nome, telefone, imagem, descricao, livros!inner(id)")
      .order("nome", { ascending: true });

    if (error) {
      console.error("Erro no supabase", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "Nenhum autor encontrado" });
    }

    return res.json(data);
  } catch (err) {
    console.error("Erro inesperado", err);
    return res.status(500).json({ error: "Erro inesperado" });
  }
};

export const GetAutorById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("users_profile")
      .select("id, nome, telefone, imagem, descricao")
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
