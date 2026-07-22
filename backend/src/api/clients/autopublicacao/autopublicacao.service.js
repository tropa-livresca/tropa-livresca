import supabase, { supabaseAdmin } from "../../common/config/supabase.js";
import { AutopublicacaoModel } from "../../common/models/autopublicacao.model.js";
import { LivroModel } from "../../common/models/livro.model.js";

export class AutopublicacaoService {
  static _parseCapasArray(livros) {
    return livros.map((livro) => {
      if (livro.capa && typeof livro.capa === "string") {
        try {
          livro.capa = JSON.parse(livro.capa);
        } catch (e) {
          livro.capa = { frente: null, verso: null, orelhas: null };
        }
      }
      return livro;
    });
  }

  static async getLivrosByIdService(userId) {
    if (!userId) {
      const error = new Error("Usuário não autenticado ou token inválido.");
      error.statusCode = 401;
      throw error;
    }

    const { data } = await LivroModel.buscarPorPerfilUsuario(userId);

    if (!data || data.length === 0) {
      const error = new Error(
        "Nenhum rascunho de livro encontrado para este autor.",
      );
      error.statusCode = 404;
      throw error;
    }

    return parseCapasArray(data);
  }

  static async updateEstadoService(livroId) {
    await AutopublicacaoModel.deixarRascunho(livroId);
  }

  static async insertLivroService({
    userId,
    dadosLivro = {},
    publicar = true,
    capa = {},
    manuscritoPath = null,
  }) {
    if (!userId) {
      const error = new Error(
        "Sessão expirada. Autentique-se novamente para publicar.",
      );
      error.statusCode = 401;
      throw error;
    }

    let manuscritoUrl = null;

    if (manuscritoPath) {
      const caminhoEsperado = `${userId}/`;

      if (!manuscritoPath.startsWith(caminhoEsperado)) {
        const error = new Error(
          "Tentativa inválida de manipulação de arquivo de outro usuário.",
        );
        error.statusCode = 403;
        throw error;
      }

      const { data: signedData, error: signedError } =
        await supabaseAdmin.storage
          .from("manuscrito-livro")
          .createSignedUrl(manuscritoPath, 31536000);

      if (signedError) {
        signedError.statusCode = 500;
        throw signedError;
      }

      manuscritoUrl = signedData.signedUrl;
    }

    const dadosParaInserir = {
      ativo: true,
      fk_user_profile_id: userId,
      estado: publicar ? "publicado" : "rascunho",
      titulo: dadosLivro.detalhes?.titulo || null,
      subtitulo: dadosLivro.detalhes?.subtitulo || null,
      descricao: dadosLivro.detalhes?.descricao || null,
      numero_edicao: dadosLivro.detalhes?.numeroEdicao
        ? parseInt(dadosLivro.detalhes.numeroEdicao, 10)
        : null,
      autor_nome: dadosLivro.detalhes?.autor?.nome || null,
      autor_sobrenome: dadosLivro.detalhes?.autor?.sobrenome || null,
      publico_alvo: dadosLivro.detalhes?.publicoPrincipal || null,
      colaboradores: dadosLivro.detalhes?.colaboradores || [],
      direitos_de_publicacao:
        dadosLivro.detalhes?.direitoPublicacao === "sim" ||
        dadosLivro.detalhes?.direitoPublicacao === true,
      conteudo_por_IA: dadosLivro.detalhes?.conteudoPorIA === true,
      imagens_explicitas: dadosLivro.detalhes?.imagensExplicitas === true,
      data_de_publicacao: new Date().toISOString().split("T")[0],
      preco_digital: dadosLivro.orcamento?.valorLivroDigital
        ? parseFloat(dadosLivro.orcamento.valorLivroDigital)
        : 0.0,
      preco_fisico: dadosLivro.orcamento?.valorLivroFisico
        ? parseFloat(dadosLivro.orcamento.valorLivroFisico)
        : 0.0,
      capa: JSON.stringify({
        frente: capa.frente || null,
        verso: capa.verso || null,
        orelhas: capa.orelhas || null,
      }),
      manuscrito: manuscritoUrl,
    };

    const novoLivro = await AutopublicacaoModel.criar(dadosParaInserir);

    return {
      data: novoLivro,
      manuscritoUrl,
    };
  }

  static async criarUploadLivroService({ userId, tipo, extensao }) {
    if (!userId) {
      const error = new Error("Usuário não autenticado.");
      error.statusCode = 401;
      throw error;
    }

    const buckets = {
      capa_frente: "capa-livros",
      capa_verso: "capa-livros",
      capa_orelhas: "capa-livros",
      manuscrito: "manuscrito-livro",
    };

    const bucket = buckets[tipo];

    if (!bucket) {
      const error = new Error("Tipo de arquivo inválido para o sistema.");
      error.statusCode = 400;
      throw error;
    }

    const path = `${userId}/livro_${tipo}_${globalThis.crypto.randomUUID()}.${extensao}`;

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      bucket,
      path,
      token: data.token,
    };
  }
}
