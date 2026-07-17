import {supabaseAdmin} from "../config/supabase.js";

export const AutopublicacaoModel = {
      async buscarDetalhesPorId(id, apenasAtivos = true) {
        let query = supabaseAdmin
          .from("livros")
          .select("id, publico_alvo, numero_edicao, data_de_publicacao, capa, titulo, subtitulo, descricao, autor_nome, autor_sobrenome, users_profile(id, nome, imagem)")
          .eq("id", id);
    
        if (apenasAtivos) {
          query = query.eq("ativo", true);
        }
    
        const { data, error } = await query.maybeSingle();
        if (error) throw error;
        return data;
      },
    
      async deixarRascunho(id) {
        const { error } = await supabaseAdmin
          .from("livros")
          .update({ estado: rascunho })
          .eq("id", id);
    
        if (error) throw error;
        return true;
      },

      async publicarRascunho(id){
        const {error} = await supabaseAdmin
        .from("livros")
        .update({estado: publicar})
        .eq("id", id);
      },
    
      async criar(dadosLivro) {
        const { data, error } = await supabaseAdmin
          .from("livros")
          .insert(dadosLivro)
          .select()
          .single();
    
        if (error) throw error;
        return data;
      }

      
}