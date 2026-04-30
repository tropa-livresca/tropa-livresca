
import { supabase } from "../../lib/supabaseClient";

export async function getUsuarios(email) {
  const { data, error } = await supabase.from("usuarios").select(email);

  if (error) {
    console.error("Erro ao buscar usuários:", error.message);
    return;
  }

  return data || [];
}



