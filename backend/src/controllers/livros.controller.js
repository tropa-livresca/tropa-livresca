import supabase, { supabaseAdmin } from "../config/supabase.js";

export const GetLivros = async (req,res) => {
 const {data, error} = await supabase.from('livros').select();
 console.log(data);
 return res.status(200).send(data);
}

export const GetLivrosDeAutor = async (req,res) => {
 const {data, error} = await supabase.from('livros').select().eq('fk_user_profile_id', req.params.autor);
 console.log(data);
 return res.status(200).send(data);
}