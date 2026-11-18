import { MovimentacoesModel } from "../../common/models/movimentacoes.model.js";
import { error } from "../../common/utils/error.js";
export class MovimentacoesService {
  static async buscarDadosMovimentacoesAutor(autorId) {
    if (!autorId) error(400, "Id do autor não informado.");

    const dados =
      await MovimentacoesModel.buscarDadosMovimentacoesAutor(autorId);

    if (dados.error) throw dados.error;

    return dados;
  }

  static async buscarMovimentacoesEditora() {
    const dados = await MovimentacoesModel.buscarDadosMovimentacoesEditora();

    if (dados.error) throw dados.error;

    return dados;
  }

  static async autorizarDepositoContaAutor(vendaId) {
    if (!vendaId) error(400, "Id da venda não informada.");

    const deposito =
      await MovimentacoesModel.autorizarDepositoContaAutor(vendaId);

    if (deposito.error) throw deposito.error;

    return deposito;
  }
}
