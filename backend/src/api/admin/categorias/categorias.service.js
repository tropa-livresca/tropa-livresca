import { CategoriasModel } from "../../common/models/categorias.model.js";

export class CategoriasService {
  static async BuscarCategorias({
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
    tipo = "",
  }) {
    try {
      const categories = await CategoriasModel.BuscarCategorias(
        page,
        limit,
        busca,
        filtro,
        ordem,
        tipo,
      );
      return categories;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async BuscarCategoriaById(id) {
    try {
      if (!id) {
        const erroId = new Error("Id não informado.");
        erroId.statusCode = 400;
        throw erroId;
      }

      const categoria = await CategoriasModel.BuscarCategoriaById(id);
      return categoria;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async CriarCategoriaLivro(userId, nome, tipo, descricao) {
    try {
      if (!userId) {
        const erroUserId = new Error("Sessão expirada. Renove a sessão.");
        erroUserId.statusCode = 401;
        throw erroUserId;
      }

      if (!nome) {
        const erroNome = new Error("Metadados da categoria não informados.");
        erroNome.statusCode = 400;
        throw erroNome;
      }

      const dadosCategoria = {
        nome: nome,
        fk_user_profile_id: userId,
        tipo: tipo,
        descricao: descricao,
      };

      const novaCategoria =
        await CategoriasModel.CriarCategoria(dadosCategoria);

      return {
        data: novaCategoria,
      };
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async InativarCategoria(id) {
    try {
      if (!id) {
        const erroId = new Error("Id da categoria livro não informado.");
        erroId.statusCode = 400;
        throw erroId;
      }

      const categoria = await CategoriasModel.InativarCategoria(id);
      return categoria;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async AtualizarCategoria(id, dadosAtualizados) {
    try {
      if (!id || !dadosAtualizados) {
        const erroDados = new Error("Dados da atualização não informados.");
        erroDados.statusCode = 400;
        throw erroDados;
      }

      const dadosFiltrados = {};
      if (dadosAtualizados.nome !== undefined)
        dadosFiltrados.nome = dadosAtualizados.nome;
      if (dadosAtualizados.tipo !== undefined)
        dadosFiltrados.tipo = dadosAtualizados.tipo;
      if (dadosAtualizados.descricao !== undefined)
        dadosFiltrados.descricao = dadosAtualizados.descricao;

      const categoriaLivro = await CategoriasModel.AlterarCategoria(
        id,
        dadosFiltrados,
      );
      return categoriaLivro;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }
}
