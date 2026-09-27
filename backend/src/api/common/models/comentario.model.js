import supabase from "../config/supabase.js";

export class ComentarioModel {
  static async buscarComentarios(idLivro, limit, secao) {
    const start = (secao - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
      .from("comentarios")
      .select(
        `
        *,
        autor:users_profile (
          nome,
          imagem
        )
      `,
        { count: "exact" },
      )
      .eq("fk_livros_id", idLivro)
      .range(start, end)
      .order("data", { ascending: false });

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    const comentariosFormatados = (data || []).map((comentario) => {
      const { autor, ...dadosComentario } = comentario;
      return {
        ...dadosComentario,
        autor_nome: autor?.nome || "Usuário Removido",
        autor_imagem: autor?.imagem || null,
      };
    });

    return {
      data: comentariosFormatados,
      count: count || 0,
    };
  }

  static async verificarAutoriaComentario(idUsuario, idComentario) {
    const { data, error } = await supabase
      .from("comentarios")
      .select("id")
      .eq("fk_user_profile_id", idUsuario)
      .eq("id", idComentario)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!data) {
      const erroComentario = new Error(
        "O comentário não pertence a este usuário ou não existe.",
      );
      erroComentario.statusCode = 403;
      throw erroComentario;
    }

    return true;
  }

  static async deletarComentario(idUsuario, idComentario) {
    await this.verificarAutoriaComentario(idUsuario, idComentario);

    const { data, error } = await supabase
      .from("comentarios")
      .delete()
      .eq("id", idComentario)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async criarComentario(dadosComentario) {
    const { data, error } = await supabase
      .from("comentarios")
      .insert(dadosComentario)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async atualizarComentario(idComentario, idUsuario, dadosAtualizados) {
    await this.verificarAutoriaComentario(idUsuario, idComentario);

    const { data, error } = await supabase
      .from("comentarios")
      .update(dadosAtualizados)
      .eq("id", idComentario)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }
}
