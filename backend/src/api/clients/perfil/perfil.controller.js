import supabase, { supabaseAdmin } from "../../common/config/supabase.js";

export const GetPerfil = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users_profile")
      .select("*")
      .eq("id", req.user.id)
      .maybeSingle();

      if (!req.user || !req.user.id) {
      console.error("Acesso negado: req.user não está definido.");
      return res.status(401).json({ error: "Usuário não autenticado ou token inválido" });
    }

    if (error) {
      console.error("ERRO DO SUPABASE NO BACKEND:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(200).json({
        id: req.user.id,
        nome: "",
        telefone: "",
        descricao: "",
        imagem: "",
      });
    } 

    return res.json(data);
  } catch (err) {
    console.error("Erro interno no GetPerfil:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

   export const UpdatePerfil = async (req, res) => {
  try {
    const { nome, telefone, descricao, redes } = req.body;

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
    const { data: perfilData, error: perfilError } = await supabaseAdmin
      .from("users_profile")
      .upsert(updates, { onConflict: "id" })
      .select()
      .maybeSingle();

    if (perfilError) {
      console.error("Erro no upsert do Supabase:", perfilError);
      return res.status(500).json({ error: perfilError.message });
    }

    if (redes) {
      const listaRedes = typeof redes === "string" ? JSON.parse(redes) : redes;

      const redesComUserId = listaRedes.map((rede) => ({
        ...rede,
        fk_user_profile_id: req.user.id,
      }));

      const { error: redesError } = await supabaseAdmin
        .from("usu_redes")
        .upsert(redesComUserId, { onConflict: "fk_user_profile_id, plataforma" });

      if(redesError){
        consoler.error("Erro ao atualizar redes sociais: ", redesError);
        return res.status(500).json(
        {
          error: "Perfil salvo, mas falha ao atualizar redes sociais",
          detalhes: redesError.message
        }
      );
      }

      perfilData.usu_redes = listaRedes;
    }

    return res.json(perfilData);
  } catch (err) {
    console.error("Erro crítico no UpdatePerfil (Catch):", err);
    return res
      .status(500)
      .json({ error: "Erro interno do servidor", mensagem: err.message });
  }
};
