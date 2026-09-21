import { supabaseAdmin } from "../../common/config/supabase.js";
import { RevisaoModel } from "../../common/models/revisao.model.js";

export class RevisaoService {
  static async BuscarLivroRevisao(busca) {
    const livros = await RevisaoModel.BuscarLivraoRevisao(busca);

    if (livros.error) {
      throw livros.error;
    }

    return livros;
  }

  static async BuscarRevisoes({
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
    livro = "",
  }) {
    const revisoes = await RevisaoModel.BuscarRevisoes(
      page,
      limit,
      busca,
      filtro,
      ordem,
      livro,
    );

    if (revisoes.error) {
      throw revisoes.error;
    }

    return revisoes;
  }

  static async BuscarRevisaoById(id) {
    if (!id) {
      const erroId = new Error("Id não especificado.");
      erroId.statusCode = 400;
      throw erroId;
    }

    const revisoes = await RevisaoModel.BuscarRevisaoById(id);

    if (revisoes.error) {
      throw revisoes.error;
    }

    return revisoes;
  }

  static async BuscarRevisaoByUserId(userId) {
    if (!userId) {
      const erroId = new Error("Id não especificado.");
      erroId.statusCode = 400;
      throw erroId;
    }

    const revisao = await RevisaoModel.BuscarRevisaoByUserId(userId);

    if (revisao.error) {
      throw revisao.error;
    }

    return revisao;
  }

  static async AtualizarRevisao(id, nome, apontamento, idLivro) {
    if (!id) {
      const erroId = new Error("Id da revisão é obrigatório.");
      erroId.statusCode = 400;
      throw erroId;
    }

    const dadosRevisao = {};
    if (nome !== undefined) dadosRevisao.nome = nome;
    if (apontamento !== undefined) dadosRevisao.apontamento = apontamento;
    if (idLivro !== undefined) dadosRevisao.fk_livros_id = idLivro;

    const revisaoAtualizada = await RevisaoModel.AtualizarRevisao(
      id,
      dadosRevisao,
    );

    if (revisaoAtualizada.error) {
      throw revisaoAtualizada.error;
    }

    return revisaoAtualizada;
  }

  static async CriarRevisao(
    nome,
    apontamento,
    idLivro,
    manuscritoRevisto = null,
    userId,
  ) {
    if (!nome || !apontamento || !idLivro || !userId) {
      const erroDados = new Error(
        "Dados de criação de revisão não informados.",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    const verificacao = await RevisaoModel.VerificarAutorLivro(userId);

    if (!verificacao) {
      const verificacaoError = new Error(
        "As revisões de livro apenas podem ser feitas por outros revisoes, fora o autor.",
      );
      verificacaoError.statusCode = 400;
      throw verificacaoError;
    }

    let manuscritoUrl = null;

    if (manuscritoRevisto) {
      const nomeArquivo = `${Date.now()}_${manuscritoRevisto.name || "arquivo.pdf"}`;

      const { data: uploadData, error: uploadError } =
        await supabaseAdmin.storage
          .from("manuscrito-livro")
          .upload(`revisoes/${nomeArquivo}`, manuscritoRevisto, {
            cacheControl: "3600",
            upsert: false,
          });

      if (uploadError) {
        uploadError.statusCode = 500;
        throw uploadError;
      }

      const { data: urlData } = supabaseAdmin.storage
        .from("manuscrito-livro")
        .getPublicUrl(uploadData.path);

      manuscritoUrl = urlData.publicUrl;
    }

    const dadosRevisao = {
      nome: nome,
      apontamento: apontamento,
      fk_livro_id: idLivro,
      arquivo: manuscritoUrl,
      fk_user_profile_id: userId,
    };

    const revisaoCriada = await RevisaoModel.CriarRevisao(dadosRevisao);

    if (revisaoCriada.error) {
      throw revisaoCriada.error;
    }

    return revisaoCriada;
  }

  static async InativarRevisao(id) {
    if (!id) {
      const erroId = new Error("Id da revisão não informado.");
      erroId.statusCode = 404;
      throw erroId;
    }

    const revisaoInativada = await RevisaoModel.InativarRevisao(id);

    if (revisaoInativada.error) {
      throw revisaoInativada.error;
    }

    return revisaoInativada;
  }

  static async publicarLivro(livroId, funcionarioId) {
    if (!livroId || !funcionarioId) {
      const erroDados = new Error(
        "Erro ao informar os dados para alterar estado de livro.",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    const verificacao = await RevisaoModel.VerificarAutorLivro(
      livroId,
      funcionarioId,
    );

    if (verificacao.error) {
      const verificacaoError = new Error("Erro ao fazer a verificação.");
      throw verificacaoError;
    }

    if (!verificacao) {
      throw new Error(
        "Autor do livro não pode ser o mesmo que o revisor de livro.",
      ).statusCode(400);
    }

    const livroPublicado = await RevisaoModel.publicarLivro(livroId);

    if (livroPublicado.error) {
      throw livroPublicado.error;
    }

    return livroPublicado;
  }

  static async negarPublicacaoLivro(idLivro, funcionarioId) {
    if (!idLivro || !funcionarioId) {
      const erroDados = new Error(
        "Erro ao informar os dados para alterar estado de livro.",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    const verificacao = await RevisaoModel.VerificarAutorLivro(
      idLivro,
      funcionarioId,
    );

    if (verificacao.error) {
      throw verificacao.error;
    }

    if (!verificacao) {
      throw new Error(
        "Autor do livro não pode ser o mesmo que o revisor de livro.",
      );
    }

    const livroNegado = await RevisaoModel.negarPublicacaoLivro(idLivro);

    if (livroNegado.error) throw livroNegado.error;

    return livroNegado;
  }

  static async solicitarCorrecaoLivro(idLivro, funcionarioId) {
    if (!idLivro || !funcionarioId) {
      const erroDados = new Error(
        "Erro ao informar os dados para alterar estado de livro.",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    const verificacao = await RevisaoModel.VerificarAutorLivro(
      idLivro,
      funcionarioId,
    );

    if (verificacao.error) {
      throw verificacao.error;
    }

    if (!verificacao) {
      throw new Error(
        "Autor do livro não pode ser o mesmo que o revisor de livro.",
      );
    }

    const livroCorrecao = await RevisaoModel.solicitarCorrecaoLivro(idLivro);

    if (livroCorrecao.error) throw livroCorrecao.error;

    return livroCorrecao;
  }
}
