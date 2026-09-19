import { supabaseAdmin } from "../../common/config/supabase.js";
import { AutopublicacaoModel } from "../../common/models/autopublicacao.model.js";

export class AutopublicacaoService {
  static _parseCapaUrls(livro) {
    if (!livro) return livro;

    const livroClonado = { ...livro };

    try {
      if (typeof livroClonado.capa === "string") {
        livroClonado.capa = JSON.parse(livroClonado.capa);
      }
    } catch (e) {
      console.warn("Erro ao parsear capa JSON", e);
    }
    return livroClonado;
  }

  static _parseCapasArray(livros) {
    return livros.map((livro) => this._parseCapaUrls(livro));
  }

  static async atualizarEstado(livroId, userId) {
    if (!livroId) {
      const erroDados = new Error(
        "Erro ao alterar livro. Dados não informados.",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    if (!userId) {
      const erroUserId = new Error("Erro de autenticação do usuário.");
      erroUserId.statusCode = 401;
      throw erroUserId;
    }

    const estadoAtual = await AutopublicacaoModel.buscarDetalhesPorId(
      livroId,
      userId,
    );

    if (!estadoAtual) {
      const erroEstadoAtual = new Error("Livro não encontrado.");
      erroEstadoAtual.statusCode = 400;
      throw erroEstadoAtual;
    }

    if (estadoAtual.error) throw estadoAtual.error;

    if (
      estadoAtual.estado === "em_revisao" ||
      estadoAtual.estado === "publicado"
    ) {
      const erroAtualizacao = new Error(
        "Livros em revisão ou publicados não podem ter seu estado alterado.",
      );
      erroAtualizacao.statusCode = 400;
      throw erroAtualizacao;
    }

    const atualizado = await AutopublicacaoModel.atualizarEstado(livroId);

    if (!atualizado.error) throw atualizado.error;

    return atualizado;
  }

  static async deletarLivroRascunho(livroId, userId) {
    const livroDeletado = await AutopublicacaoModel.deletarLivro(
      livroId,
      userId,
    );

    if (livroDeletado.error) throw livroDeletado.error;

    return livroDeletado;
  }

  static async buscarComFiltros({
    userId,
    page,
    limit,
    busca,
    filtro,
    ordem,
    estado,
  }) {
    const resultado = await AutopublicacaoModel.buscarComFiltros({
      userId,
      page,
      limit,
      busca,
      filtro,
      ordem,
      estado,
    });

    if (resultado.error) throw resultado.error;

    const listaLivros = resultado.data;
    const total = resultado.count;

    const livrosFormatados = this._parseCapasArray(listaLivros);

    return {
      data: livrosFormatados,
      meta: {
        totalItems: total,
        limit,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async buscarDetalhesPorId(livroId, userId) {
    if (!userId) {
      const erroUserId = new Error("Sessão expirada. Renovar login.");
      erroUserId.statusCode = 401;
      throw erroUserId;
    }

    if (!livroId) {
      const erroLivroId = new Error("O id do livro não foi informado.");
      erroLivroId.statusCode = 500;
      throw erroLivroId;
    }

    const resultado = await AutopublicacaoModel.buscarDetalhesPorId(
      livroId,
      userId,
    );

    if (resultado.error) throw resultado.error;

    return resultado;
  }

  static async criarLivro({
    userId,
    dadosLivro = {},
    estadoInicial = "rascunho",
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
      estado: estadoInicial,
      ISBN: dadosLivro.detalhes?.ISBN || null,
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

    const novoLivro = await AutopublicacaoModel.criarLivro(dadosParaInserir);

    if (novoLivro.error) throw novoLivro.error;

    return {
      data: novoLivro,
      manuscritoUrl,
    };
  }

  static async atualizarLivro({
    userId,
    livroId,
    dadosLivro = {},
    capa = {},
    manuscritoPath = null,
  }) {
    if (!userId) {
      const error = new Error(
        "Sessão expirada. Autentique-se novamente para atualizar.",
      );
      error.statusCode = 401;
      throw error;
    }

    if (!livroId) {
      const error = new Error("ID do livro é obrigatório para atualização.");
      error.statusCode = 400;
      throw error;
    }

    const livroAtual = await AutopublicacaoModel.buscarDetalhesPorId(
      livroId,
      userId,
    );

    if (!livroAtual) {
      const error = new Error(
        "Livro não encontrado ou não pertence ao usuário.",
      );
      error.statusCode = 404;
      throw error;
    }

    if (
      livroAtual.estado === "em_revisao" ||
      livroAtual.estado === "publicado"
    ) {
      const error = new Error(
        "Este livro está travado para alterações no momento.",
      );
      error.statusCode = 403;
      throw error;
    }

    let manuscritoUrl = livroAtual.manuscrito || null;

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

    const dadosParaAtualizar = {
      ISBN: dadosLivro.detalhes?.ISBN || livroAtual.ISBN,
      titulo: dadosLivro.detalhes?.titulo || livroAtual.titulo,
      subtitulo: dadosLivro.detalhes?.subtitulo || livroAtual.subtitulo,
      descricao: dadosLivro.detalhes?.descricao || livroAtual.descricao,
      numero_edicao: dadosLivro.detalhes?.numeroEdicao
        ? parseInt(dadosLivro.detalhes.numeroEdicao, 10)
        : livroAtual.numero_edicao,
      autor_nome: dadosLivro.detalhes?.autor?.nome || livroAtual.autor_nome,
      autor_sobrenome:
        dadosLivro.detalhes?.autor?.sobrenome || livroAtual.autor_sobrenome,
      publico_alvo:
        dadosLivro.detalhes?.publicoPrincipal || livroAtual.publico_alvo,
      colaboradores:
        dadosLivro.detalhes?.colaboradores || livroAtual.colaboradores,
      direitos_de_publicacao:
        dadosLivro.detalhes?.direitoPublicacao === "sim" ||
        dadosLivro.detalhes?.direitoPublicacao === true ||
        livroAtual.direitos_de_publicacao,
      conteudo_por_IA:
        dadosLivro.detalhes?.conteudoPorIA === true ||
        livroAtual.conteudo_por_IA,
      imagens_explicitas:
        dadosLivro.detalhes?.imagensExplicitas === true ||
        livroAtual.imagens_explicitas,
      preco_digital: dadosLivro.orcamento?.valorLivroDigital
        ? parseFloat(dadosLivro.orcamento.valorLivroDigital)
        : livroAtual.preco_digital,
      preco_fisico: dadosLivro.orcamento?.valorLivroFisico
        ? parseFloat(dadosLivro.orcamento.valorLivroFisico)
        : livroAtual.preco_fisico,
      capa: JSON.stringify({
        frente:
          capa.frente ||
          (livroAtual.capa ? JSON.parse(livroAtual.capa).frente : null),
        verso:
          capa.verso ||
          (livroAtual.capa ? JSON.parse(livroAtual.capa).verso : null),
        orelhas:
          capa.orelhas ||
          (livroAtual.capa ? JSON.parse(livroAtual.capa).orelhas : null),
      }),
      manuscrito: manuscritoUrl,
    };

    const atualizado = await AutopublicacaoModel.atualizarLivro(
      livroId,
      dadosParaAtualizar,
    );

    if (atualizado.error) throw atualizado.error;

    return { data: atualizado, manuscritoUrl };
  }

  static async criarUploadLivro({ userId, tipo, extensao }) {
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
