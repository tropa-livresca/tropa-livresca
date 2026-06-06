import supabase, { supabaseAdmin } from "../config/supabase.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
};

export const GetAutor = async() =>{
       return ( await supabase.from('livros').select());
}

/*
Vou armazenar as imagens no storage, para o perfil
export const GetAutores = async (req, res) =>{
  const data = await supabase.from('users_profile').select('nome');
  res.status(200).json(data);
  return(data);
}
*/