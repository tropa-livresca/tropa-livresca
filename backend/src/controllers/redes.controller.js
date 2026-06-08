import supabase, { supabaseAdmin } from "../config/supabase";

export const GetRedes = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("usu_redes")
      .select("*")
      .eq("id", id);

    if (error) {
      console.error("Erro de consulta no supabase", error);
      res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(200).json({
        id: id,
        link: "",
        tipo_rede_social: "",
      });
    }

    return res.json(data);
  } catch (err) {
    console.error("Erro de consulta no supabase", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const PostRedes = async (req, res) => {
  try {
    const { id, redesocial, link } = req.body;

    const create = {
      id: req.user.id,
      redesocial,
      link,
    };

    if(!create){
        return res.status(500);
    }

    const { data, error } = await supabaseAdmin
      .from("usu_redes")
      .insert(create, { onConflict: "id" })
      .select();

    if (error) {
      console.error("Erro na criação de rede social", error);
      return res
        .status(500)
        .json({ error: "Problema na inserção de rede social de usuário." });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro de criação de rede social", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const UpdateRede = async () => {};
