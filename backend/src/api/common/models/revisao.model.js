import supabase, { supabaseAdmin } from "../config/supabase.js";
import {
  LIVRO_ESTADO,
  TRANSICOES_ADMINISTRADOR,
  transicaoPermitida,
} from "../config/livro-estados.js";
export class RevisaoModel {
  static async BuscarLivroRevisao(busca) {
    const { data, error } = await supabase
      .from("livros")
      .select(
        "id, titulo, subtitulo, capa, autor_nome, autor_sobrenome, estado",
      )
      .ilike("titulo", `%${busca}%`);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async BuscarRevisoes(
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
    livro = "",
  ) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from("revisoes")
      .select(
        "*, livros!inner(id, titulo, subtitulo, capa, autor_nome, autor_sobrenome, fk_user_profile_id)",
        { count: "exact" },
      );

    if (busca) {
      query = query.or(`nome.ilike.%${busca}%`);
    }

    if (livro) {
      query = query.eq("fk_livro_id", livro);
    }

    if (filtro === "data") {
      const isAsc = ordem === "ascendente";
      query = query.order("data_de_criacao", { ascending: isAsc });
    } else {
      const isAsc = ordem !== "descendente";
      query = query.order("nome", { ascending: isAsc });
    }

    const { data, error, count } = await query.range(start, end);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data: data || [],
      livros: (data || []).map((revisao) => revisao.livros).filter(Boolean),
      count: count || 0,
    };
  }

  static async BuscarRevisaoById(id) {
    const { data, error } = await supabase
      .from("revisoes")
      .select("*, livros!inner(*)")
      .eq("id", id)
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data: data,
      livro: data.livros,
    };
  }

  static async BuscarRevisaoByUserId(userId) {
    const { data, error } = await supabase
      .from("revisoes")
      .select(
        "*, livros!inner(id, titulo, subtitulo, capa, autor_nome, autor_sobrenome, fk_user_profile_id)",
      )
      .eq("fk_user_profile_id", userId);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data: data || [],
    };
  }

  static async BuscarRevisaoByLivroId(livroId) {
    const { data, error } = await supabase
      .from("revisoes")
      .select(
        "*, livros!inner(id, titulo, subtitulo, capa, autor_nome, autor_sobrenome, fk_user_profile_id)",
      )
      .eq("fk_livro_id", livroId);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data: data || [],
    };
  }

  static async AtualizarRevisao(id, funcionarioId, dadosAtualizados) {
    const { data, error } = await supabaseAdmin
      .from("revisoes")
      .update(dadosAtualizados)
      .eq("id", id)
      .eq("fk_user_profile_id", funcionarioId)
      .eq("completado", false)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!data) {
      const updateError = new Error(
        "Revisão não encontrada ou não pertence ao administrador.",
      );
      updateError.statusCode = 403;
      throw updateError;
    }

    return data;
  }

  static async VerificarAutorLivro(livroId, funcionarioId) {
    const { data, error } = await supabase
      .from("livros")
      .select()
      .eq("id", livroId)
      .eq("fk_user_profile_id", funcionarioId)
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (data) {
      return false;
    }

    return true;
  }

  static async VerificarRevisor(livroId, funcionarioId) {
    console.log("c");
    const { data, error } = await supabase
      .from("revisoes")
      .select("*, livros!inner(estado)")
      .eq("completado", false)
      .eq("fk_livro_id", livroId)
      .maybeSingle();

    console.log(data);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (data) {
      let revisor = false;
      if (data.fk_user_profile_id == funcionarioId) {
        revisor = true;
      }
      return { ...data, revisor };
    }

    return null;
  }

  static async atualizarEstadoComRevisao(livroId, novoEstado, funcionarioId) {
    if (
      !transicaoPermitida(
        LIVRO_ESTADO.EM_REVISAO,
        novoEstado,
        TRANSICOES_ADMINISTRADOR,
      )
    ) {
      const error = new Error("Transição administrativa de estado inválida.");
      error.statusCode = 400;
      throw error;
    }

    const { data: revisao, error: revisaoError } = await supabaseAdmin
      .from("revisoes")
      .select("id, fk_livro_id, fk_user_profile_id, completado")
      .eq("fk_livro_id", livroId)
      .eq("fk_user_profile_id", funcionarioId)
      .eq("completado", false)
      .maybeSingle();

    if (revisaoError) {
      revisaoError.statusCode = 500;
      throw revisaoError;
    }

    if (!revisao) {
      const error = new Error(
        "Administrador não possui revisão pendente vinculada a este livro.",
      );
      error.statusCode = 403;
      throw error;
    }

    const { data: livro, error: livroError } = await supabaseAdmin
      .from("livros")
      .update({ estado: novoEstado })
      .eq("id", livroId)
      .eq("ativo", true)
      .eq("estado", LIVRO_ESTADO.EM_REVISAO)
      .select()
      .maybeSingle();

    if (livroError) {
      livroError.statusCode = 500;
      throw livroError;
    }

    if (!livro) {
      const error = new Error(
        "O livro não está em revisão ou seu estado foi alterado.",
      );
      error.statusCode = 409;
      throw error;
    }

    const { data: revisaoConcluida, error: conclusaoError } =
      await supabaseAdmin
        .from("revisoes")
        .update({ completado: true })
        .eq("id", revisao.id)
        .eq("fk_livro_id", livroId)
        .eq("fk_user_profile_id", funcionarioId)
        .eq("completado", false)
        .select()
        .maybeSingle();

    if (conclusaoError || !revisaoConcluida) {
      await supabaseAdmin
        .from("livros")
        .update({ estado: LIVRO_ESTADO.EM_REVISAO })
        .eq("id", livroId)
        .eq("estado", novoEstado)
        .eq("ativo", true);

      const error =
        conclusaoError || new Error("Não foi possível concluir a revisão.");
      error.statusCode = conclusaoError ? 500 : 409;
      throw error;
    }

    return { ...livro, revisao: revisaoConcluida };
  }

  static async buscarLivroParaRevisao(livroId) {
    const { data, error } = await supabaseAdmin
      .from("livros")
      .select("id, estado, ativo")
      .eq("id", livroId)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async buscarRevisaoPendentePorLivro(livroId) {
    const { data, error } = await supabaseAdmin
      .from("revisoes")
      .select("id, fk_livro_id, fk_user_profile_id, completado")
      .eq("fk_livro_id", livroId)
      .eq("completado", false)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async buscarRevisaoParaAtualizacao(id, funcionarioId) {
    const { data, error } = await supabaseAdmin
      .from("revisoes")
      .select("id, fk_livro_id, fk_user_profile_id, completado")
      .eq("id", id)
      .eq("fk_user_profile_id", funcionarioId)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async CriarRevisao(dadosRevisao) {
    console.log(dadosRevisao);
    const { data, error } = await supabaseAdmin
      .from("revisoes")
      .insert(dadosRevisao)
      .select()
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async CompletarRevisao(id, funcionarioId) {
    const { data: revisao, error: revisaoError } = await supabaseAdmin
      .from("revisoes")
      .select("id, fk_livro_id, fk_user_profile_id, completado")
      .eq("id", id)
      .eq("fk_user_profile_id", funcionarioId)
      .maybeSingle();

    if (revisaoError) {
      revisaoError.statusCode = 500;
      throw revisaoError;
    }

    if (!revisao) {
      const error = new Error(
        "Revisão não encontrada ou não pertence ao administrador.",
      );
      error.statusCode = 403;
      throw error;
    }

    if (revisao.completado) return revisao;

    const { data: livro, error: livroError } = await supabaseAdmin
      .from("livros")
      .select("estado")
      .eq("id", revisao.fk_livro_id)
      .maybeSingle();

    if (livroError) {
      livroError.statusCode = 500;
      throw livroError;
    }

    if (
      ![
        LIVRO_ESTADO.PUBLICADO,
        LIVRO_ESTADO.NEGADO,
        LIVRO_ESTADO.RECALL,
      ].includes(livro?.estado)
    ) {
      const error = new Error(
        "A revisão só pode ser concluída após uma decisão administrativa.",
      );
      error.statusCode = 409;
      throw error;
    }

    const { data, error } = await supabaseAdmin
      .from("revisoes")
      .update({ completado: true })
      .eq("id", id)
      .eq("fk_user_profile_id", funcionarioId)
      .eq("completado", false)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!data) {
      const updateError = new Error(
        "Revisão já foi concluída ou está desatualizada.",
      );
      updateError.statusCode = 409;
      throw updateError;
    }

    return data;
  }

  static async ExcluirRevisao(id) {
    const { data, error } = await supabase
      .from("revisoes")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async publicarLivro(idLivro, funcionarioId) {
    return this.atualizarEstadoComRevisao(
      idLivro,
      LIVRO_ESTADO.PUBLICADO,
      funcionarioId,
    );
  }

  static async SolicitarRecallLivro(idLivro, funcionarioId) {
    return this.atualizarEstadoComRevisao(
      idLivro,
      LIVRO_ESTADO.RECALL,
      funcionarioId,
    );
  }

  static async negarPublicacaoLivro(idLivro, funcionarioId) {
    return this.atualizarEstadoComRevisao(
      idLivro,
      LIVRO_ESTADO.NEGADO,
      funcionarioId,
    );
  }
}
