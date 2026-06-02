import supabase from "../config/supabase.js"

export const GetPerfil = async(req, res) =>{
    const {data, error} = await supabase.from('users_profile').select("*").eq("id", supabase.auth.user().id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json(data);
}

export const UpdatePerfil = async(req, res) =>{
    const {nome, descricacao, imagem} = req.body;
    const {data, error} = await supabase.from('users_profile').update({nome, descricacao, imagem}).eq("id", supabase.auth.user().id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json(data);
}