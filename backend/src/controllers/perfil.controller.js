import supabase, {supabaseAdmin} from "../config/supabase.js";

export const GetPerfil = async (req, res) => {
  const { data, error } = await supabase
    .from("users_profile")
    .select("*")
    .eq("id", req.user.id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.json(data);
};

export const UpdatePerfil = async (req, res) => {
  const {nome, telefone, descricao} = req.body;

  let imagemUrl;
  
  if (req.file) {
    const extensao = req.file.originalname.split('.').pop();
    const filePath = `images/${req.user.id}/perfil.${extensao}`;

    const {error: uploadError} = await supabaseAdmin.storage
    .from("public_box")
    .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
    });

    if(uploadError){
        return res.status(500).json({error: uploadError.message});
    }

    const {data: publicUrlData} = supabaseAdmin.storage
    .from("public_box")
    .getPublicUrl(filePath);

    imagemUrl = publicUrlData.publicUrl;

    const updates = {
        nome,
        telefone,
        descricao,
    };

    if(imagemUrl){
        updates.imagem = imagemUrl;
    }

    const {data, error} = await supabase
    .from("users_profile")
    .update(updates)
    .eq("id", req,user.id)
    .select()
    .single();

    if(error){
        return res.status(500).json({error: error.message});
    }

  }

  const { data, error } = await supabase
    .from("users_profile")
    .update({ nome, telefone, descricao, imagem })
    .eq("id", req.user.id)
    .select()
    .single();
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.json(data);
};
