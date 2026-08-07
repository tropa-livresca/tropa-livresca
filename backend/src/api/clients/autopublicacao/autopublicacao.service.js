import { supabaseAdmin } from "../../common/config/supabase.js";
import { AutopublicacaoModel } from "../../common/models/autopublicacao.model.js";

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

  static async getLivrosById(userId) {
    try {
      if (!userId) {
        const error = new Error("Usuário não autenticado ou token inválido.");
        error.statusCode = 401;
        throw error;
      }

      const { data } = await AutopublicacaoModel.buscarComFiltros({ userId });

      if (!data || data.length === 0) {
        const error = new Error(
          "Nenhum rascunho de livro encontrado para este autor.",
        );
        error.statusCode = 404;
        throw error;
      }

      return this._parseCapasArray(data);
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async updateEstado(livroId, novoEstado) {
    try {
      await AutopublicacaoModel.updateEstado(livroId, novoEstado);
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async deletarLivroRascunho(livroId, userId) {
    try {
      await AutopublicacaoModel.deletarLivro(livroId, userId);
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async buscarComFiltros({ userId, page, limit, busca, filtro, ordem }) {
    try {
      return await AutopublicacaoModel.buscarComFiltros({
        userId,
        page,
        limit,
        busca,
        filtro,
        ordem,
      });
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async inativarLivro(livroId, userId) {
    try {
      await AutopublicacaoModel.inativarLivro(livroId, userId);
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async insertLivroService({
    userId,
    dadosLivro = {},
    estadoInicial = "rascunho",
    capa = {},
    manuscritoPath = null,
  }) {
    try {
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

      const novoLivro = await AutopublicacaoModel.criar(dadosParaInserir);

      return {
        data: novoLivro,
        manuscritoUrl,
      };
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async updateLivroService({
    userId,
    livroId,
    dadosLivro = {},
    capa = {},
    manuscritoPath = null,
  }) {
    try {
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

      // Verifica existência e propriedade do livro
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

      const atualizado = await AutopublicacaoModel.atualizar(
        livroId,
        dadosParaAtualizar,
      );

      return { data: atualizado, manuscritoUrl };
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async criarUploadLivroService({ userId, tipo, extensao }) {
    try {
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
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }
}
