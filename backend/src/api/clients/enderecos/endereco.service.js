import { EnderecoModel } from "../../common/models/endereco.model.js";

export class EnderecoService {
  static async BuscarEnderecos(userId) {
    if (!userId) {
      const erroUserId = new Error("Id do usuário não informado na requisição.");
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
      const erroBanco = new Error("Erro ao buscar pelo endereço em específico.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }

  static async BuscarEnderecoPrincipal(userId){
    if(!userId){
      const erroDados = new Error("Sessão expirada. Logue novamente.");
      erroDados.statusCode = 401;
      throw erroDados;
    }

    try{
      const {data} = await EnderecoModel.BuscarEnderecoPrincipal(userId);

      if(!data){
        const erroEndereco = new Error("Endereço não encontrado.");
        erroEndereco.statusCode = 404;
        throw erroEndereco;
      }

      return data;
    }catch(error){
      if(error.statusCode) throw error;
      const erroBanco = new Error("Erro ao buscar pelo endereço em específico.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }
  
  static async AtualizarEnderecoById(id, dadosAtualizados, userId) {
    if (!id || !dadosAtualizados) {
      const erroDados = new Error("Dados para atualização do endereço não informados.");
      erroDados.statusCode = 500;
      throw erroDados;
    }

    if (!userId) {
      const erroUserId = new Error("Sessão expirada. Por favor, logue-se novamente.");
      erroUserId.statusCode = 401;
      throw erroUserId;
    }

    try {
      const dadosParaAtualizar = {
        estado: dadosAtualizados.estado || null,
        bairro: dadosAtualizados.bairro || null,
        rua: dadosAtualizados.rua || null,
        num: dadosAtualizados.num || dadosAtualizados.numero || null,
        cep: dadosAtualizados.cep || dadosAtualizados.CEP || null,
        cidade: dadosAtualizados.cidade || null,
        complemento: dadosAtualizados.complemento || null,
        pais: dadosAtualizados.pais || null
      };

      const { data } = await EnderecoModel.AtualizarEnderecoById(
        id,
        dadosParaAtualizar,
        userId,
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

  static async InativarEndereco(id, userId) {
    if (!id) {
      const erroId = new Error("Id do endereço não informado.");
      erroId.statusCode = 500;
      throw erroId;
    }

    if (!userId) {
      const erroUserId = new Error("Sessão expirada. Logue novamente.");
      erroUserId.statusCode = 401;
      throw erroUserId;
    }

    try {
      const { data } = await EnderecoModel.InativarEndereco(id, userId);

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

  static async CriarEndereco({ userId, dadosEndereco = {} }) {
    if (!userId) {
      const erroDados = new Error("Sessão expirada. Autentique-se novamente para publicar.");
      erroDados.statusCode = 401;
      throw erroDados;
    }

    try {
      const dadosParaInserir = {
        ativo: true,
        estado: dadosEndereco.estado || null,
        bairro: dadosEndereco.bairro || null,
        rua: dadosEndereco.rua || null,
        num: dadosEndereco.num || dadosEndereco.numero || null,
        cep: dadosEndereco.cep || dadosEndereco.CEP || null,
        cidade: dadosEndereco.cidade || null,
        complemento: dadosEndereco.complemento || null,
        pais: dadosEndereco.pais || null,
        fk_user_profile_id: userId
      };

      const { data } = await EnderecoModel.CriarEndereco(dadosParaInserir);

      if (!data) {
        const erroCriar = new Error("Erro ao registrar o endereço.");
        erroCriar.statusCode = 500;
        throw erroCriar;
      }

      return data;
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error("Erro ao criar novo endereço.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }

  static async DefinirEnderecoPrincipal(id, userId) {
    if (!id) {
      const erroId = new Error("Id do endereço não informado.");
      erroId.statusCode = 500;
      throw erroId;
    }

    if (!userId) {
      const erroUserId = new Error("Sessão expirada. Logue novamente.");
      erroUserId.statusCode = 401;
      throw erroUserId;
    }

    try {
      const { data } = await EnderecoModel.DefinirPrincipal(id, userId);

      if (!data) {
        const erroPrincipal = new Error("Erro ao definir endereço como principal.");
        erroPrincipal.statusCode = 500;
        throw erroPrincipal;
      }

      return data;
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error("Erro ao atualizar o endereço principal.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }
}
