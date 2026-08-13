import { RevisaoModel } from "../../common/models/revisao.model.js";

export class RevisaoService {
  static async BuscarRevisoes({
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
    livro = "",
  }) {
    try {
      const revisoes = await RevisaoModel.BuscarRevisoes(
        page,
        limit,
        busca,
        filtro,
        ordem,
        livro,
      );

      return revisoes;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async BuscarRevisaoById(id) {
    try {
      if (!id) {
        const erroId = new Error("Id não especificado.");
        erroId.statusCode = 500;
        throw erroId;
      }

      const revisao = await RevisaoModel.BuscarRevisaoById(id);

      return revisao;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async AtualizarRevisao(id, nome, apontamento, idLivro) {
    try {
      const dadosRevisao = {
        nome: nome || "",
        apontamento: apontamento || "",
        fk_livros_id: idLivro || "",
      };

      const revisaoAtualizada = await RevisaoModel.AtualizarRevisao(
        id,
        dadosRevisao,
      );

      return revisaoAtualizada;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async CriarRevisao(nome, apontamento, idLivro) {
    try {
      if (!nome || !apontamento || !idLivro) {
        const erroDados = new Error(
          "Dados de criação de revisão não informados.",
        );
        erroDados.statusCode = 500;
        throw erroDados;
      }

      const dadosRevisao = {
        nome: nome,
        apontamento: apontamento,
        fk_livros_id: idLivro,
      };

      const revisaoCriada = await RevisaoModel.CriarRevisao(dadosRevisao);

      return revisaoCriada;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async InativarRevisao(id) {
    try {
      if (!id) {
        const erroId = new Error("Id da revisão não informado.");
        erroId.statusCode = 404;
        throw erroId;
      }

      const revisaoInativada = await RevisaoModel.InativarRevisao(id);

      return revisaoInativada;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async AlterarEstadoLivro(idLivro, novoEstado) {
    try {
      if (!idLivro || !novoEstado) {
        const erroDados = new Error(
          "Erro ao informar os dados para alterar estado de livro.",
        );
        erroDados.statusCode = 500;
        throw erroDados;
      }

      const livroRevisado = await RevisaoModel.AlterarEstadoLivro(
        idLivro,
        novoEstado,
      );

      return livroRevisado;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }
}
