import supabase from "../config/supabase.js"

export const GetPerfil = async(req, res) =>{
    const {data, error} = await supabase
        .from('users_profile')
        .select("*")
        .eq("id", req.user.id)
        .single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json(data);
}

export const UpdatePerfil = async(req, res) =>{
    const {nome, telefone, descricao, imagem} = req.body;
    const {data, error} = await supabase
        .from('users_profile')
        .update({nome, telefone, descricao, imagem})
        .eq("id", req.user.id)
        .select()
        .single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json(data);
}
