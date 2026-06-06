import supabase, { supabaseAdmin } from "../config/supabase.js";

export const GetAutores = async (req, res) => {
  try {
    const { data, error } = await supabase.from("users_profile").select("*");

    if (error) {
      console.error("Erro no supabase", error);
      return res.status(500).json({ error: error.message });
    }

    if(!data){
      return res.status(404).json({ error: "Nenhum autor encontrado" });
    }

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
      .select()
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
