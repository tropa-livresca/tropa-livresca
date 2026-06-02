import supabase, { supabaseAdmin } from "../config/supabase.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
};

export const GetAutor = async(userId) =>{
       return ( await supabase.from('livros').select());
}