import { EnderecoModel } from "../../common/models/endereco.model.js";

export class EnderecoService {
  static async BuscarEnderecos(userId) {
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
        erroEndereco.statusCode = 500;
        throw erroEndereco;
      }

      return data;
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error("Erro ao buscar endereços no catálago.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }

  static async BuscarEnderecoById(id, userId) {
    if (!id || !userId) {
      const erroId = new Error("Id não informado na requisição.");
      erroId.statusCode = 500;
      throw erroId;
    }

    try {
      const { data } = await EnderecoModel.BuscarEnderecoById(id, userId);

      if (!data) {
        const erroEndereco = new Error("Endereço não encontrado.");
        erroEndereco.statusCode = 404;
        throw erroEndereco;
      }

      return data;
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error(
        "Erro ao buscar pelo endereço em específico.",
      );
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }

  static async AtualizarEnderecoById(id, dadosAtualizados) {
    if (!id || !dadosAtualizados) {
      const erroDados = new Error(
        "Dados para atualização do endereço não informados.",
      );
      erroDados.statusCode = 500;
      throw erroDados;
    }

    try {
     const dadosParaAtualizar = {
        estado: dadosAtualizados.estado || null,
        bairro: dadosAtualizados.bairro || null,
        rua: dadosAtualizados.rua || null,
        num: dadosAtualizados.num || null,
        cep: dadosAtualizados.cep || null,
        cidade: dadosAtualizados.cidade || null,
        complemento: dadosAtualizados.complemento || null,
    };

      const { data } = await EnderecoModel.AtualizarEnderecoById(
        id,
        dadosParaAtualizar,
      );

      if (!data) {
        const erroData = new Error("Erro ao atualizar os dados.");
        erroData.statusCode = 500;
        throw erroData;
      }

      return data;
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error("Erro ao atualizar endereço By Id");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }

  static async InativarEndereco(id) {
    if (!id) {
      const erroId = new Error("Id do endereço não informado.");
      erroId.statusCode = 500;
      throw erroId;
    }

    try {
      const { data } = await EnderecoModel.InativarEndereco(id);

      if (!data) {
        const erroInativar = new Error("Erro ao inativar endereço.");
        erroInativar.statusCode = 500;
        throw erroInativar;
      }

      return data;
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error("Erro ao inativar o endereço.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }
  static async CriarEndereco({userId, dadosEndereco = {}}) {
    if (!userId) {
      const erroDados = new Error("Sessão expriada. Autentique-se novamente para publicar.");
      erroDados.statusCode = 401;
      throw erroDados;
    }

    try {

    const dadosParaInserir = {
        ativo: true,
        estado: dadosEndereco.estado || null,
        bairro: dadosEndereco.bairro || null,
        rua: dadosEndereco.rua || null,
        num: dadosEndereco.num || null,
        cep: dadosEndereco.cep || null,
        cidade: dadosEndereco.cidade || null,
        complemento: dadosEndereco.complemento|| null, 
        fk_user_profil_id: userId
    };

      const { data } = await EnderecoModel.CriarEndereco(dadosParaInserir);

      return data;
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error("Erro ao criar novo endereço.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }
}
