import { MovimentacoesModel } from "../../common/models/movimentacoes.model.js";
import { error, errorUsuarioId } from "../../common/utils/error.js";
export class MovimentacoesService {
  static async criarConta(
    usuarioId,
    CPF,
    nomeCompleto,
    numeroBanco,
    numeroAgencia,
    numeroConta,
    tipoConta,
  ) {
    if (!usuarioId) errorUsuarioId();

    if (!CPF || !nomeCompleto || !numeroBanco || !numeroAgencia || !tipoConta)
      error(400, "Dados para cdriação da conta não informados.");

    const dadosBancarios = {
      CPF,
      nome_completo: nomeCompleto,
      numero_banco: numeroBanco,
      numero_agencia: numeroAgencia,
      numero_conta: numeroConta,
      tipo_conta: tipoConta,
    };

    const conta = await MovimentacoesModel.criarConta(
      usuarioId,
      dadosBancarios,
    );

    if (conta.error) throw conta.error;

    return conta;
  }

  static async alterarDadosConta(
    usuarioId,
    CPF,
    nomeCompleto,
    numeroBanco,
    numeroAgencia,
    numeroConta,
    tipoConta,
  ) {
    if (!usuarioId) errorUsuarioId();

    const dadosBancarios = {
      CPF,
      nome_completo: nomeCompleto,
      numero_banco: numeroBanco,
      numero_agencia: numeroAgencia,
      numero_conta: numeroConta,
      tipo_conta: tipoConta,
    };

    const contaAlterada = await MovimentacoesModel.alterarDadosConta(
      usuarioId,
      dadosBancarios,
    );

    return contaAlterada;
  }

  static async solicitarSaque(usuarioId, valorSaque) {
    if (!usuarioId) errorUsuarioId();

    if (!valorSaque) error(400, "Valor do saque não informado.");

    const saque = await MovimentacoesModel.solicitarSaque(
      usuarioId,
      valorSaque,
    );

    if (saque.error) throw saque.error;

    return saque;
  }

  static async buscarDadosMovimentacoesAutor(usuarioId) {
    if (!usuarioId) errorUsuarioId();

    const dados =
      await MovimentacoesModel.buscarDadosMovimentacoesAutor(usuarioId);

    if (dados.error) throw dados.error;

    return dados;
  }

  static async buscarDadosBancarios(usuarioId) {
    if (!usuarioId) errorUsuarioId();

    const dadosBancarios =
      await MovimentacoesModel.buscarDadosBancarios(usuarioId);

    if (dadosBancarios.error) throw dadosBancarios.error;

    return dadosBancarios;
  }
}
