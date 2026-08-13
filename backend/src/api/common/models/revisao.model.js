import supabase from "../config/supabase";

export class RevisaoModel{
    static async BuscarRevisoes(){
        const {data, error} = supabase
        .from("revisoes")
        .select("*");

        if(error){
            error.statusCode = 500;
            throw error;
        }
        
        return data;
    }

    static async BuscarRevisaoById(){}

    static async AtualizarRevisao(){}

    static async AtualizarEstadoLivro(){}

    static async CriarRevisao(){}

    static async ExcluirRevisao(){}
}