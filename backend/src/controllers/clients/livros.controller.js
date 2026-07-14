import supabase, { supabaseAdmin } from "../../config/supabase.js";

// Helper para parsear e estruturar URLs de capa
const parseCapaUrls = (livro) => {
  if (!livro) return livro;

  try {
    if (typeof livro.capa === "string") {
      // Tenta parsear como JSON
      livro.capa = JSON.parse(livro.capa);
    }
  } catch (e) {
    // Se falhar, mantém como string (URL simples ou provisória)
    console.warn("Erro ao parsear capa JSON", e);
  }

  return livro;
};

// Helper para aplicar parseCapaUrls em array de livros
const parseCapasArray = (livros) => {
  return livros.map(parseCapaUrls);
};

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

    const livrosComCapas = parseCapasArray(livrosUnicos);

    const totalItens = count || livrosComCapas.length;

    return res.status(200).json({
      data: livrosComCapas,
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
      .eq("ativo", true);

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

    const livrosComCapas = parseCapasArray(data);
    return res.status(200).json(livrosComCapas);
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

    const livroComCapa = parseCapaUrls(livro);

    return res.status(200).json({
      data: {
        ...livroComCapa,
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
      .update({ ativo: false })
      .eq("id", req.params.id);

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

export const InsertLivro = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
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
        return res.status(403).json({
          error: "Manuscrito inválido para este usuário",
        });
      }

      const { data: signedData, error: signedError } =
        await supabaseAdmin.storage
          .from("manuscrito-livro")
          .createSignedUrl(
            manuscritoPath,
            31536000,
          );

      if (signedError) {
        console.error(
          "Erro ao criar URL assinada:",
          signedError,
        );

        return res.status(500).json({
          error:
            "Erro ao gerar acesso ao manuscrito",
        });
      }

      manuscritoUrl = signedData.signedUrl;
    }

    const dadosParaInserir = {
      fk_user_profile_id: userId,

      estado: publicar
        ? "publicado"
        : "rascunho",

      titulo:
        dadosLivro.detalhes?.titulo || null,

      subtitulo:
        dadosLivro.detalhes?.subtitulo || null,

      descricao:
        dadosLivro.detalhes?.descricao || null,

      numero_edicao:
        dadosLivro.detalhes?.numeroEdicao
          ? parseInt(
              dadosLivro.detalhes.numeroEdicao,
              10,
            )
          : null,

      autor_nome:
        dadosLivro.detalhes?.autor?.nome || null,

      autor_sobrenome:
        dadosLivro.detalhes?.autor?.sobrenome || null,

      publico_alvo:
        dadosLivro.detalhes?.publicoPrincipal || null,

      colaboradores:
        dadosLivro.detalhes?.colaboradores || [],

      direitos_de_publicacao:
        dadosLivro.detalhes?.direitoPublicacao === "sim" ||
        dadosLivro.detalhes?.direitoPublicacao === true,

      conteudo_por_IA:
        dadosLivro.detalhes?.conteudoPorIA === true,

      imagens_explicitas:
        dadosLivro.detalhes?.imagensExplicitas === true,

      data_de_publicacao:
        new Date().toISOString().split("T")[0],

      preco_digital:
        dadosLivro.orcamento?.valorLivroDigital
          ? parseFloat(
              dadosLivro.orcamento.valorLivroDigital,
            )
          : 0.0,

      preco_fisico:
        dadosLivro.orcamento?.valorLivroFisico
          ? parseFloat(
              dadosLivro.orcamento.valorLivroFisico,
            )
          : 0.0,

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
      console.error(
        "Erro ao inserir livro:",
        error,
      );

      return res.status(500).json({
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    }

    return res.status(201).json({
      data: novoLivro,
      manuscritoUrl,
    });
  } catch (error) {
    console.error(
      "Erro fatal no InsertLivro:",
      error,
    );

    return res.status(500).json({
      error: error.message,
      type: error.name,
    });
  }
};

export const CriarUploadLivro = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const { tipo, extensao } = req.body;
    const userId = req.user.id;

    const buckets = {
      capa_frente: "capa-livros",
      capa_verso: "capa-livros",
      capa_orelhas: "capa-livros",
      manuscrito: "manuscrito-livro",
    };

    const bucket = buckets[tipo];

    if (!bucket) {
      return res.status(400).json({
        error: "Tipo de arquivo inválido",
      });
    }

    const path =
      `${userId}/livro_${tipo}_${crypto.randomUUID()}.${extensao}`;

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) {
      console.error("Erro ao criar upload assinado:", error);

      return res.status(500).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      bucket,
      path,
      token: data.token,
    });
  } catch (error) {
    console.error("Erro em CriarUploadLivro:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};