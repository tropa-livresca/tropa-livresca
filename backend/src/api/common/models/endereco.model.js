import {  criarClienteModel, marcarErro } from "./pocketbase.helpers.js";

const COLECAO = "enderecos";
const RELACAO_PERFIL = "fk_user_profile_id";

async function buscarEnderecos(userId, filtros = {}) {
  const pb = await criarClienteModel();

  const partesFiltro = [`${RELACAO_PERFIL} = {:userId}`];

  const params = { userId };

  for (const [campo, valor] of Object.entries(filtros)) {
    partesFiltro.push(`${campo} = {:${campo}}`);
    params[campo] = valor;
  }

  return await pb.collection(COLECAO).getFullList({
    filter: pb.filter(partesFiltro.join(" && "), params),
  });
}

async function buscarEndereco(userId, id, ativo = null) {
  const enderecos = await buscarEnderecos(
    userId,
    ativo === null ? {} : { ativo },
  );

  return enderecos.find((endereco) => endereco.id === id) || null;
}

export class EnderecoModel {
  static async BuscarEnderecos(userId) {
    try {
      return {
        data: await buscarEnderecos(userId, {
          ativo: true,
        }),
      };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async BuscarEnderecoPrincipal(userId) {
    try {
      const enderecos = await buscarEnderecos(userId, {
        principal: true,
        ativo: true,
      });

      return {
        data: enderecos[0] || null,
      };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async BuscarEnderecoById(id, userId) {
    try {
      return {
        data: await buscarEndereco(userId, id),
      };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async AtualizarEnderecoById(id, dadosAtualizados, userId) {
    const pb = await criarClienteModel();

    const endereco = await buscarEndereco(userId, id);

    if (!endereco) {
      const error = new Error("Endereço não encontrado.");
      error.statusCode = 404;
      throw error;
    }

    try {
      return {
        data: await pb.collection(COLECAO).update(id, dadosAtualizados),
      };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async InativarEndereco(id, userId) {
    return this.AtualizarEnderecoById(id, { ativo: false }, userId);
  }

  static async CriarEndereco(userId, dadosEndereco) {
    const pb = await criarClienteModel();

    if (!userId) {
      const error = new Error(
        "Usuário não identificado para criar o endereço.",
      );

      error.statusCode = 401;
      throw error;
    }

    const dados = {
      ...dadosEndereco,
      [RELACAO_PERFIL]: userId,
    };

    try {
      const endereco = await pb.collection(COLECAO).create(dados);

      return { data: endereco };
    } catch (error) {
      marcarErro(error, 400);
    }
  }

  static async DefinirPrincipal(id, userId) {
    const pb = await criarClienteModel();
    const colecao = pb.collection(COLECAO);

    try {
      const endereco = await buscarEndereco(userId, id);

      if (!endereco) {
        const error = new Error("Endereço não encontrado.");
        error.statusCode = 404;
        throw error;
      }

      const enderecos = await colecao.getFullList({
        filter: pb.filter("fk_user_profile_id = {:userId}", {
          userId,
        }),
      });

      for (const item of enderecos) {
        if (item.principal && item.id !== id) {
          await colecao.update(item.id, {
            principal: false,
          });
        }
      }

      return {
        data: await colecao.update(id, {
          principal: true,
        }),
      };
    } catch (error) {
      marcarErro(error);
    }
  }
}
