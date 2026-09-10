import supabase from "../config/supabase.js";
import {supabaseAdmin} from "../config/supabase.js";


export class FuncionariosModel{
    static async alterarFuncao(usuarioId, funcao)    { 
      console.log("c")
      console.log(usuarioId)

        const { data, error } = await supabaseAdmin
      .from("users_profile")
      .update({ funcao: funcao, is_admin: funcao == "funcionario"})
      .eq("id", usuarioId)
      .select()
      .maybeSingle()

      console.log(data);

    if (error) {
      console.log(error)
      throw error;
    }

    if (!data) {
      const erroRegistro = new Error("Nenhum perfil foi encontrado para atualização.");
      erroRegistro.statusCode = 404;
      throw erroRegistro;
    }

    console.log(data);
    console.log(1);
    console.log(error);

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