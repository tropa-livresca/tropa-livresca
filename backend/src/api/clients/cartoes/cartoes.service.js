import { CartoesModel } from "../../common/models/cartoes.model.js";
import { error, errorUsuarioId } from "../../common/utils/error.js";

export class CartoesService {
  static async adicionarCartao(
    token_pagamento,
    final_cartao,
    bandeira_varchar,
    nome_no_cartao,
    data_expiracao,
    usuarioId,
  ) {
    if (!usuarioId) errorUsuarioId();

    if (
      !token_pagamento ||
      !final_cartao ||
      !bandeira_varchar ||
      !nome_no_cartao ||
      !data_expiracao
    )
      error(400, "Dados do cartão não informados para cadastro.");

    const dadosCartao = {
      token_pagamento,
      final_cartao,
      bandeira_varchar,
      nome_no_cartao,
      data_expiracao,
      fk_user_profile_id: usuarioId,
    };

    const cartaoAdicionado = await CartoesModel.adicionarCartao(dadosCartao);

    if (cartaoAdicionado.error) throw cartaoAdicionado.error;

    return cartaoAdicionado;
  }

  static async alterarCartao(
    cartaoId,
    token_pagamento,
    final_cartao,
    bandeira_varchar,
    nome_no_cartao,
    data_expiracao,
  ) {
    if (!cartaoId) error(400, "Id do cartão não informado.");

    if (
      !token_pagamento ||
      !final_cartao ||
      !bandeira_varchar ||
      !nome_no_cartao ||
      !data_expiracao
    )
      error(400, "Dados do cartão não informados para cadastro.");

    const dadosAtualizados = {
      token_pagamento: token_pagamento || "",
      final_cartao: final_cartao || "",
      bandeira_varchar: bandeira_varchar || "",
      nome_no_cartao: nome_no_cartao || "",
      data_expiracao: data_expiracao || "",
    };

    const cartaoAlterado = await CartoesModel.alterarCartao(
      cartaoId,
      dadosAtualizados,
    );

    if (cartaoAlterado.error) throw cartaoAlterado.error;

    return cartaoAlterado;
  }

  static async deletarCartao(cartaoId, usuarioId) {
    if (!usuarioId) errorUsuarioId();

    if (!cartaoId) error(400, "Id do cartão não informado para deletar.");

    const cartaoDeletado = await CartoesModel.deletarCartao(
      cartaoId,
      usuarioId,
    );

    if (cartaoDeletado.error) throw cartaoDeletado.error;

    return cartaoDeletado;
  }

  static async buscarCartao(cartaoId) {
    if (!cartaoId) error(400, "Id do cartão não informado para deletar.");

    const cartao = await CartoesModel.buscarCartao(cartaoId);

    if (cartao.error) throw cartao.error;

    return cartao;
  }

  static async buscarCartoes(usuarioId) {
    if (!usuarioId) errorUsuarioId();

    const cartoes = await CartoesModel.buscarCartoes(usuarioId);

    if (cartoes.error) throw cartoes.error;

    return cartoes;
  }
}
