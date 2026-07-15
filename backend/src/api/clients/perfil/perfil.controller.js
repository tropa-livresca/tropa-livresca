import { supabaseAdmin } from "../../../common/config/supabase.js";

export const GetPerfil = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      const erro401 = new Error("Usuário não autenticado ou token inválido.");
      erro401.statusCode = 401;
      throw erro401;
    }

    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .select("*")
      .eq("id", req.user.id)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!data) {
      return res.json({
        id: req.user.id,
        nome: "",
        telefone: "",
        descricao: "",
        imagem: "",
      });
    } 

    return res.json(data);
  } catch (err) {
    next(err);
  }
};

export const UpdatePerfil = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      const erro401 = new Error("Sessão expirada. Autentique-se novamente para salvar as alterações.");
      erro401.statusCode = 401;
      throw erro401;
    }

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
        uploadError.statusCode = 500;
        throw uploadError;
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
      perfilError.statusCode = 500;
      throw perfilError;
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

      if (redesError) {
        const erroParcial = new Error(`Perfil salvo, mas falha ao atualizar redes sociais: ${redesError.message}`);
        erroParcial.statusCode = 400;
        throw erroParcial;
      }

      perfilData.usu_redes = listaRedes;
    }

    return res.json(perfilData);
  } catch (err) {
    next(err);
  }
};
