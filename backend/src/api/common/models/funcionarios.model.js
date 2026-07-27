import supabase from "../config/supabase.js";

export class FuncionariosModel{
    static async promoverAdm(usuarioComumId, senhaTemporaria, funcao)    { 
      const { data, error } = await supabase.
      rpc('promover_usuario_para_adm', {
        p_user_profile_id: usuarioComumId,
        p_senha_inicial_adm: senhaTemporaria,
        p_funcao: funcao
      });
      
      if(error){
        error.statusCode = 500;
        throw error;
      }

      return data;
}

    static async deletarFuncionario(funcionarioId){
        const {data, error} = await supabase
        .from("adm_credenciais")
        .delete()
        .eq("id", funcionarioId)
        .select();
        
        if(error){
            error.statusCode = 500;
            throw error;
        }

        return data;
    }

    static async atualizarCargo(funcionarioId, funcao){
        const {data, error} = await supabase
        .from("adm_credenciais")
        .update({funcao: funcao})
        .eq("id", funcionarioId)
        .select()
        .single();
        
        if(error){
            error.statusCode = 500;
            throw error;
        }

        return data;
    }
}