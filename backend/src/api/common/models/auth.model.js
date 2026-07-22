import supabase from "../config/supabase.js";

export class AuthModel {
    static async buscarPorUsername(username){
        const {data, error} = await supabase
        .from ('vw_auth_adm')
        .select("*")
        .eq('username', username.toLowerCase().trim())
        .single();

        if(error && error.code !=="PGRST116"){
            throw error;
        }
        return data;
    }

    static async atualizarSenha(userId, novaSenhaCriptografada){
        const{data, error} = supabase
        .from ("adm_credenciais")
        .update({
            senha_adm: novaSenhaCriptografada,
            forcar_troca_senha: false
        })
        .eq("fk_user_profile_id", userId)
        .select();

        if(error) throw error;
        return data;
    }
}