import supabase, { supabaseAdmin } from "../config/supabase.js";

export const GetLivros = async (req,res) => {
 const {data, error} = await supabase.from('livros').select();
 console.log(data);
 return res.status(200).send(data);
}
