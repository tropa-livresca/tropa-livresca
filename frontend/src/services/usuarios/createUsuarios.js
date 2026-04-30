import { supabase } from "../../lib/supabaseClient";

export async function createUsuarios(usuario){
    const {data, error} = await supabase
    .from("usuarios")
    .insert([usuario])
    .select();

    if(error){
        console.error("Erro ao inserir usuário", error.message);
        return null;
    }

    return data[0];
}