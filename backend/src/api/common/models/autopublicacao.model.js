import { supabaseAdmin } from "../config/supabase.js";

export class AutopublicacaoModel {
  static async buscarDetalhesPorId(id) {
    let query = supabaseAdmin
      .from("livros")
      .select("*")
      .eq("id", id)
      .eq("ativo", true);

    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data;
  }

  static async updateEstado(id, rascunho) {

    const {data: livroAtual, error: fetchError} = await supabaseAdmin
    .from("livros")
    .select("estado")
    .eq("id", id)
    .single();

    if (fetchError) throw fetchError;

    if(livroAtual.estado === "publicado" && rascunho === true){
      throw new Error("Um livro publicado não pode voltar a ser rascunho.");
    }

    const novoEstado = rascunho ? "rascunho" : "publicado";
    
    const { error: updateError } = await supabaseAdmin
      .from("livros")
      .update({ estado: novoEstado })
      .eq("id", id);
    queryError = error;

    if(updateError) throw updateError;
    return true;
  }

  static async inativarLivro(id) {
    const { error } = await supabaseAdmin
      .from("livros")
      .update({ ativo: false })
      .eq("id", id);

    if (error) throw error;
    return true;
  }

  static async criar(dadosLivro) {
    const { data, error } = await supabaseAdmin
      .from("livros")
      .insert(dadosLivro)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
