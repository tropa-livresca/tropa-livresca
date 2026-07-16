import { supabaseAdmin } from "../../common/config/supabase.js";
import { PerfilModel } from "../../common/models/perfil.model.js";

export const getPerfilService = async (userId) => {
  if (!userId) {
    const erro401 = new Error("Usuário não autenticado ou token inválido.");
    erro401.statusCode = 401;
    throw erro401;
  }

  const perfil = await PerfilModel.buscarPorId(userId);

  if (!perfil) {
    return {
      id: userId,
      nome: "",
      telefone: "",
      descricao: "",
      imagem: "",
    };
  }

  return perfil;
};

export const updatePerfilService = async ({ userId, dadosPerfil, file, redes }) => {
  if (!userId) {
    const erro401 = new Error("Sessão expirada. Autentique-se novamente para salvar as alterações.");
    erro401.statusCode = 401;
    throw erro401;
  }

  const { nome, telefone, descricao } = dadosPerfil;

  const updates = {
    id: userId,
    nome,
    telefone,
    descricao,
  };

  if (file) {
    const extensao = file.originalname.split(".").pop();
    const filePath = `images/${userId}/perfil.${extensao}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("public_box")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
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
    const listaRedes = typeof redes === "string" ? JSON.parse(redes) : redes;
    await PerfilModel.salvarRedes(userId, listaRedes);

    perfilData.usu_redes = listaRedes;
  }

  return perfilData;
};
