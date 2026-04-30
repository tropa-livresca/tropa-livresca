import supabase, { supabaseAdmin } from "../config/supabase.js";

export const GetPerfil = async (req, res) => {
  console.log("ID do usuário logado requisição:", req.user?.id); 
  try {
    const { data, error } = await supabase
      .from("users_profile")
      .select("*")
      .eq("id", req.user.id)
      .maybeSingle();

    if (error) {
      console.error("ERRO DO SUPABASE NO BACKEND:", error); 
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.json({ nome: "", telefone: "", descricao: "", imagem: "" });
    }

    return res.json(data);
  } catch (err) {
    console.error("Erro interno no GetPerfil:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const UpdatePerfil = async (req, res) => {
  try {
    const { nome, telefone, descricao } = req.body;
    
    const updates = {
      id: req.user.id,
      nome,
      telefone,
      descricao,
    };

    if (req.file) {
      const extensao = req.file.originalname.split(".").pop();
      const filePath = `images/${req.user.id}/perfil.${extensao}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("public_box")
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        return res.status(500).json({ error: uploadError.message });
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("public_box")
        .getPublicUrl(filePath);

      updates.imagem = publicUrlData.publicUrl;
    }
    const { data, error } = await supabase
      .from("users_profile")
      .upsert(updates, { onConflict: "id" })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Erro no upsert do Supabase:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);

  } catch (err) {
    console.error("Erro crítico no UpdatePerfil (Catch):", err);
    return res.status(500).json({ error: "Erro interno do servidor", mensagem: err.message });
  }
};
