import { supabaseAdmin } from "../../common/config/supabase.js";

import { PerfilModel } from "../../common/models/perfil.model.js";

export const GetPerfil = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      const erro401 = new Error("Usuário não autenticado ou token inválido.");
      erro401.statusCode = 401;
      throw erro401;
    }

    const perfil = await PerfilModel.buscarPorId(req.user.id);

    if (!perfil) {
      return res.json({
        id: req.user.id,
        nome: "",
        telefone: "",
        descricao: "",
        imagem: "",
      });
    }

    return res.json(perfil);
  } catch (err) {
    next(err);
  }
};

export const UpdatePerfil = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      const erro401 = new Error(
        "Sessão expirada. Autentique-se novamente para salvar as alterações.",
      );
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

    const perfilData = await PerfilModel.salvar(updates);

    if (redes) {
      const listaRedes =
      typeof redes === "string" ? JSON.parse(redes) : redes;
      await PerfilModel.salvarRedes(req.user.id, listaRedes);

      perfilData.usu_redes = listaRedes;
    }
 
    return res.json(perfilData);
  } catch (err) {
    next(err);
  }
};
