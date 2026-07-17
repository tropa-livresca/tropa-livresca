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
      redes_sociais: { instagram: "", facebook: "", linkedin: "", email: "" },
    };
  }

  return perfil;
};

export const updatePerfilService = async ({ userId, dadosPerfil, file, redes_sociais }) => {
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

  if (redes_sociais) {
    updates.redes_sociais = typeof redes_sociais === "string" 
      ? JSON.parse(redes_sociais) 
      : redes_sociais;
  }

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

  return perfilData;
};
