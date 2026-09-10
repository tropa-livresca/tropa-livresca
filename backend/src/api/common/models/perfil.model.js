import { supabaseAdmin } from "../config/supabase.js";

export class PerfilModel {

  static async buscarPerfilAdmin({ page = 1, limit = 12, busca = "", ordem = "", funcao= "" }) {

    const start = (page - 1) * limit;
    const end = start + limit - 1;



    let query = supabaseAdmin
      .from("users_profile")
      .select("id, nome, funcao , telefone, imagem, descricao, redes_sociais, is_admin, transicao_de_status, encrypted_admin_password ,livros (ativo, estado, titulo, capa, id), revisoes(data_criacao, apontamento, fk_livro_id, nome)", { count: "exact" })

    if (busca) {
      query = query.or(`nome.ilike.%${busca}%`);
    }

    const isAsc = ordem !== "descendente";
    query = query.order("nome", { ascending: isAsc });


    if (funcao === "funcionario") {
      query = query.neq("funcao", "");
    } else if (funcao === "autor") {
      query = supabaseAdmin.from("users_profile")
      .select("id, nome, funcao , telefone, imagem, descricao, redes_sociais, is_admin, transicao_de_status, encrypted_admin_password , livros!inner(ativo, estado, titulo, capa, id), revisoes(data_criacao, apontamento, fk_livro_id, nome)", {
        count: "exact",
      })
      .eq("livros.ativo", true)
      .eq("livros.estado", "publicado")
    } 

    let { data, error, count } = await query.range(start, end);

    const isAutor = data.map(usuario => {
      if(usuario.livros.length > 0){

        let livroPublicado = false;

        usuario.livros.map((livro) => {
          if(livro.ativo == true && livro.estado == "publicado"){
            livroPublicado = true
          }
  
        })

         if(livroPublicado == true){
            return true
          }else{
            return false
          }
      }else{
        return false
      }
    })

    console.log(isAutor);

    data = data.map((usuario, c) => {
      usuario = {...usuario, autor: isAutor[c]};
      return usuario
    })

    console.log(data)

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data: data || [],
      count: count || 0,
    };


    /*

    const response = await supabaseAdmin
      .from("users_profile")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!response) return null;
    if (response.error) throw response.error;

    return response.data;

    */
  }

  static async buscarPerfil(id) {
    const response = await supabaseAdmin
      .from("users_profile")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!response) return null;
    if (response.error) throw response.error;

    return response.data;
  }

  static async atualizarPerfil(userId, dadosPerfil) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .update(dadosPerfil)
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async atualizarApenasImagem(userId, urlImagem) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .update({ imagem: urlImagem })
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      const erroRegistro = new Error("Nenhum perfil foi encontrado para atualização.");
      erroRegistro.statusCode = 404;
      throw erroRegistro;
    }

    return data;
  }
}
