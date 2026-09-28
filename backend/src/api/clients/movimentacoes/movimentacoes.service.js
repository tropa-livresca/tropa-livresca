import { MovimentacoesModel } from "../../common/models/movimentacoes.model.js";

export class MovimentacoesService {
  static async criarConta(usuarioId, dadosBancarios) {}

  static async alterarDadosConta(usuarioId, novosDadosBancarios) {}

  static async solicitarSaque(usuarioId, valorSaque) {}

  static async buscarDadosMovimentacoesAutor(usuarioId) {}
}
