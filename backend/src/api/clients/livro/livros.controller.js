import supabase, { supabaseAdmin } from "../../../common/config/supabase.js";

const parseCapaUrls = (livro) => {
  if (!livro) return livro;
  try {
    if (typeof livro.capa === "string") {
      livro.capa = JSON.parse(livro.capa);
    }
  } catch (e) {
    console.warn("Erro ao parsear capa JSON", e);
  }
  return livro;
};

const parseCapasArray = (livros) => {
  return livros.map(parseCapaUrls);
};

export const GetLivros = async (req, res, next) => {
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
      error.statusCode = 500;
      throw error;
    }

    if (!data || data.length === 0) {
      const erro404 = new Error("Nenhum livro foi encontrado na vitrine.");
      erro404.statusCode = 404;
      throw erro404;
    }

    const livrosComCapas = parseCapasArray(data);

    return res.status(200).json({
      data: livrosComCapas,
      meta: {
        page,
        limit,
        totalItems: count || livrosComCapas.length,
        totalPages: Math.ceil((count || livrosComCapas.length) / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const GetLivrosById = async (req, res, next) => {
  try {
    // Validação de segurança antecipada para evitar queries de usuários fantasma
    if (!req.user || !req.user.id) {
      const erro401 = new Error("Usuário não autenticado ou token inválido.");
      erro401.statusCode = 401;
      throw erro401;
    }

    const { data, error } = await supabase
      .from("livros")
      .select("*")
      .eq("fk_user_profile_id", req.user.id)
      .eq("ativo", true);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!data || data.length === 0) {
      const erro404 = new Error("Nenhum rascunho de livro encontrado para este autor.");
      erro404.statusCode = 404;
      throw erro404;
    }

    const livrosComCapas = parseCapasArray(data);
    return res.status(200).json(livrosComCapas);
  } catch (err) {
    next(err);
  }
};

export const GetLivrosByAutor = async (req, res, next) => {
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
      errorLivro.statusCode = 500;
      throw errorLivro;
    }

    if (!livro) {
      const erro404 = new Error("O livro solicitado não existe ou está indisponível.");
      erro404.statusCode = 404;
      throw erro404;
    }

    const { data: colaboradores, error: errorColaborador } = await supabaseAdmin
      .from("colaboradores")
      .select("nome, sobrenome, funcao")
      .eq("fk_livros_id", id)
      .order("nome", { ascending: true });

    if (errorColaborador) {
      errorColaborador.statusCode = 500;
      throw errorColaborador;
    }

    const livroComCapa = parseCapaUrls(livro);

    return res.status(200).json({
      data: {
        ...livroComCapa,
        colaboradores: colaboradores || [],
      },
    });
  } catch (err) {
    next(err);
  }
};

export const UpdateStatusAtivo = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from("livros")
      .update({ ativo: false })
      .eq("id", req.params.id);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return res.status(200).end();
  } catch (err) {
    next(err);
  }
};

export const InsertLivro = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      const erro401 = new Error("Sessão expirada. Autentique-se novamente para publicar.");
      erro401.statusCode = 401;
      throw erro401;
    }

    const {
      dadosLivro = {},
      publicar = true,
      capa = {},
      manuscritoPath = null,
    } = req.body;

    const userId = req.user.id;
    let manuscritoUrl = null;

    if (manuscritoPath) {
      const caminhoEsperado = `${userId}/`;

      if (!manuscritoPath.startsWith(caminhoEsperado)) {
        const erro403 = new Error("Tentativa inválida de manipulação de arquivo de outro usuário.");
        erro403.statusCode = 403;
        throw erro403;
      }

      const { data: signedData, error: signedError } = await supabaseAdmin.storage
        .from("manuscrito-livro")
        .createSignedUrl(manuscritoPath, 31536000);

      if (signedError) {
        signedError.statusCode = 500;
        throw signedError;
      }

      manuscritoUrl = signedData.signedUrl;
    }

    const dadosParaInserir = {
      fk_user_profile_id: userId,
      estado: publicar ? "publicado" : "rascunho",
      titulo: dadosLivro.detalhes?.titulo || null,
      subtitulo: dadosLivro.detalhes?.subtitulo || null,
      descricao: dadosLivro.detalhes?.descricao || null,
      numero_edicao: dadosLivro.detalhes?.numeroEdicao ? parseInt(dadosLivro.detalhes.numeroEdicao, 10) : null,
      autor_nome: dadosLivro.detalhes?.autor?.nome || null,
      autor_sobrenome: dadosLivro.detalhes?.autor?.sobrenome || null,
      publico_alvo: dadosLivro.detalhes?.publicoPrincipal || null,
      colaboradores: dadosLivro.detalhes?.colaboradores || [],
      direitos_de_publicacao: dadosLivro.detalhes?.direitoPublicacao === "sim" || dadosLivro.detalhes?.direitoPublicacao === true,
      conteudo_por_IA: dadosLivro.detalhes?.conteudoPorIA === true,
      imagens_explicitas: dadosLivro.detalhes?.imagensExplicitas === true,
      data_de_publicacao: new Date().toISOString().split("T")[0],
      preco_digital: dadosLivro.orcamento?.valorLivroDigital ? parseFloat(dadosLivro.orcamento.valorLivroDigital) : 0.0,
      preco_fisico: dadosLivro.orcamento?.valorLivroFisico ? parseFloat(dadosLivro.orcamento.valorLivroFisico) : 0.0,
      capa: JSON.stringify({
        frente: capa.frente || null,
        verso: capa.verso || null,
        orelhas: capa.orelhas || null,
      }),
      manuscrito: manuscritoUrl,
    };

    console.time("Tempo do insert");
    const { data: novoLivro, error } = await supabase
      .from("livros")
      .insert(dadosParaInserir)
      .select()
      .single();
    console.timeEnd("Tempo do insert");

    if (error) {
      error.statusCode = 400;
      throw error;
    }

    return res.status(201).json({
      data: novoLivro,
      manuscritoUrl,
    });
  } catch (err) {
    next(err);
  }
};
