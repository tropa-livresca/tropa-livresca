import { EnderecoModel } from "../../common/models/endereco.model.js";

export class EnderecoService {
  static async BuscarEnderecos(userId) {
    console.log(userId);
    if (!userId) {
      const erroUserId = new Error(
        "Id do usuário não informado na requisição.",
      );
      erroUserId.statusCode = 500;
      throw erroUserId;
    }

    try {
      const { data } = await EnderecoModel.BuscarEnderecos(userId);

      if (!data || data.length === 0) {
        const erroEndereco = new Error("Endereços não encontrados.");
        erroEndereco.statusCode = 404;
        throw erroEndereco;
      }

      return data;
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error("Erro ao buscar endereços no catálogo.");
      erroBanco.statusCode = 500;
      throw error;
    }
  }
}
