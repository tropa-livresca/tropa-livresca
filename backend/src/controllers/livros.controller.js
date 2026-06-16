import supabase, { supabaseAdmin } from "../config/supabase.js";

export const GetLivros = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const busca = req.query.busca || "";

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  try {
    let query = supabaseAdmin
      .from("livros")
      .select("*", { count: "exact" })
      .eq("ativo", true)
      .order("titulo", { ascending: true });

    if (busca) {
      query = query.ilike("titulo", `%${busca}%`);
    }

    const { data, error, count } = await query.range(start, end);

    if (error) {
      console.error("Erro ao buscar os livros", error);
      return;
    }

    if (!data) {
      return res.status(404).error("Nenhum livro encontrado", error);
    }

    const livrosUnicos = data.filter(
      (livro, index, self) =>
        self.findIndex((a) => a.id === livro.id) === index,
    );

    const totalItens = count || livrosUnicos.length;

    return res.status(200).json({
      data,
      meta: {
        page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error("Erro inesperado", err);
    return res.status(500).json({ error: "Erro inesperado" });
  }
};

export const GetLivrosById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("livros")
      .select("*")
      .eq("fk_user_profile_id", req.user.id)
      .eq("ativo", true)

    if (!req.user.id || !req.user) {
      console.error("Acesso negado: req.user não está definido");
      return res
        .status(401)
        .json({ error: "Usuário não autenticado ou token inválido" });
    }

    if (error) {
      console.error("Erro no supabase", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      console.error("Erro ao buscar livros", error);
      return res.status(404).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("ERRO DO SUPABASE", err);
    return res.status(500).json({ error: error.message });
  }
};

export const GetLivrosByAutor = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: livro, error: errorLivro } = await supabaseAdmin
      .from("livros")
      .select(
        "id, publico_alvo, numero_edicao, data_de_publicacao, capa, titulo, subtitulo, descricao, autor_nome, autor_sobrenome, users_profile(id, nome, imagem)",
      )
      .eq("id", id)
      .maybeSingle();

    if (errorLivro) {
      console.error("Erro interno do supabase", errorLivro);
      return res.status(500).json({ errorLivro: error.message });
    }

    if (!livro) {
      console.error("Erro ao buscar livros de autor específico por id");
      return res.status(404).json({ errorLivro: error.message });
    }

    const { data: colaboradores, error: errorColaborador } = await supabaseAdmin
      .from("colaboradores")
      .select("nome, sobrenome, funcao")
      .eq("fk_livros_id", id)
      .order("nome", { ascending: true });

    if (errorColaborador) {
      console.error("Erro interno do supabase", errorColaborador);
      return res.status(500).json({ errorColaborador: error.message });
    }

    return res.status(200).json({
      data: {
        ...livro,
        colaboradores: colaboradores || [],
      },
    });
  } catch (err) {
    console.error("ERRO DO SUPABASE", err);
    return res.status(500).json({ error: error.message });
  }
};

export const UpdateStatusAtivo = async (req, res) => {
  try {
    const { error } = await supabase
      .from("livros")
      .update({ativo: false})
      .eq("id", req.params.id)

    if (error) {
      console.error("Erro no supabase", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).end();
  } catch (err) {
    console.error("ERRO DO SUPABASE", err);
    return res.status(500).json({ error: error.message });
  }
};

export const InsertLivro = async (req,res) => {

  try {

    const selectLastId = await supabaseAdmin
      .from("livros")
      .select("*")
      .order("id", {ascending: false})
      .limit(1);

     const {data} = selectLastId
    

    const {error} = await supabase
                  .from("livros")
                  .insert({
                            id: data[0].id + 1,
                            fk_user_profile_id: req.user.id,
                          })

      if (!req.user.id || !req.user) {
      console.error("Acesso negado: req.user não está definido");
      return res
        .status(401)
        .json({ error: "Usuário não autenticado ou token inválido" });
    }


    if (error) {
      console.error("Erro no supabase", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({data: data[0]});
  } catch (err) {
    console.error("ERRO DO SUPABASE", err);
    return res.status(500).json({ error: error.message });
  }

}

export const UpdateTipoDePublicacao = async (req, res) => {
  try {
    const { error } = await supabase
      .from("livros")
      .update({tipo_de_livro: req.params.tdp})
      .eq("id", req.params.id)

    if (error) {
      console.error("Erro no supabase", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).end();
  } catch (err) {
    console.error("ERRO DO SUPABASE", err);
    return res.status(500).json({ error: error.message });
  }
};
