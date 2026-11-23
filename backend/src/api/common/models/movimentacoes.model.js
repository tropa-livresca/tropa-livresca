import { criarClienteModel, marcarErro } from "./pocketbase.helpers.js";

const COLECAO_MOVIMENTACOES = "movimentacoes_financeiras";
const COLECAO_PERFIL = "users_profile";
const RELACAO_PERFIL = "fk_user_profile_id";
const RELACAO_VENDA = "fk_vendas_id";
const PERCENTUAL_AUTOR = 0.3;

async function buscarPerfil(pb, usuarioId) {
  try {
    return await pb.collection(COLECAO_PERFIL).getOne(usuarioId);
  } catch (error) {
    if (error.status === 404) return null;
    marcarErro(error);
  }
}

export class MovimentacoesModel {
  static async criarConta(usuarioId, dadosBancarios) {
    return this.alterarDadosConta(usuarioId, dadosBancarios);
  }

  static async alterarDadosConta(usuarioId, novosDadosBancarios) {
    const pb = criarClienteModel();
    const perfil = await buscarPerfil(pb, usuarioId);

    if (!perfil) {
      const error = new Error("Perfil não encontrado para atualizar os dados.");
      error.statusCode = 404;
      throw error;
    }

    try {
      return await pb.collection(COLECAO_PERFIL).update(usuarioId, {
        dados_bancarios: novosDadosBancarios,
      });
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarDadosMovimentacoesAutor(autorId) {
    const pb = criarClienteModel();

    try {
      const data = await pb.collection(COLECAO_MOVIMENTACOES).getFullList({
        filter: pb.filter(
          `${RELACAO_PERFIL} = {:perfilId} && status = 'concluido'`,
          { perfilId: autorId },
        ),
        sort: "-data",
      });

      const saldo = data.reduce((acc, mov) => {
        const valor = Number(mov.valor);
        return mov.tipo === "entrada" ? acc + valor : acc - valor;
      }, 0);

      return {
        extrato: data,
        saldo: Math.round(saldo * 100) / 100,
      };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarDadosMovimentacoesEditora() {
    const pb = criarClienteModel();

    try {
      const data = await pb.collection(COLECAO_MOVIMENTACOES).getFullList({
        filter: pb.filter(`${RELACAO_PERFIL} = '' && status = 'concluido'`),
        sort: "-data",
      });

      const somar = (tipo) =>
        data
          .filter((mov) => mov.tipo === tipo)
          .reduce((acc, mov) => acc + Number(mov.valor), 0);

      const arredondar = (valor) => Math.round(valor * 100) / 100;

      const totalVendas = somar("entrada");
      const totalRepassado = somar("saida");

      return {
        extrato: data,
        totalVendas: arredondar(totalVendas),
        totalRepassado: arredondar(totalRepassado),
        saldoTotalCaixa: arredondar(totalVendas - totalRepassado),
      };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async autorizarDepositoContaAutor(vendaId) {
    const pb = criarClienteModel();

    try {
      const venda = await pb.collection("vendas").getOne(vendaId);

      if (venda.status_pagamento !== "pago") {
        const error = new Error(
          "O repasse só pode ser autorizado para vendas pagas.",
        );
        error.statusCode = 400;
        throw error;
      }

      const existentes = await pb
        .collection(COLECAO_MOVIMENTACOES)
        .getList(1, 1, {
          filter: pb.filter(`${RELACAO_VENDA} = {:vendaId}`, {
            vendaId,
          }),
          fields: "id",
        });

      if (existentes.items.length) {
        const error = new Error("O repasse desta venda já foi autorizado.");
        error.statusCode = 409;
        throw error;
      }

      const itens = await pb.collection("itens_venda").getFullList({
        filter: pb.filter(`${RELACAO_VENDA} = {:vendaId}`, {
          vendaId,
        }),
        expand: "fk_livros_itens_id",
      });

      if (!itens.length) {
        const error = new Error(
          "Itens da venda não encontrados para realizar o depósito.",
        );
        error.statusCode = 404;
        throw error;
      }

      const data = new Date().toISOString();

      const movimentacoes = itens.flatMap((item) => {
        const valorTotalItem = Number(item.subtotal);
        const autorId = item.expand?.fk_livros_itens_id?.fk_user_profile_id;

        const comissaoAutor =
          Math.round(valorTotalItem * PERCENTUAL_AUTOR * 100) / 100;

        const base = {
          data,
          status: "concluido",
          [RELACAO_VENDA]: vendaId,
        };

        return [
          {
            ...base,
            [RELACAO_PERFIL]: "",
            tipo: "entrada",
            valor: valorTotalItem,
            descricao: `Venda bruta registrada no sistema para o pedido #${vendaId}`,
          },
          {
            ...base,
            [RELACAO_PERFIL]: "",
            tipo: "saida",
            valor: comissaoAutor,
            descricao: `Split de repasse de direitos autorais enviado ao autor da venda #${vendaId}`,
          },
          {
            ...base,
            [RELACAO_PERFIL]: autorId,
            tipo: "entrada",
            valor: comissaoAutor,
            descricao: `Crédito de direitos autorais recebidos pelo pedido #${vendaId}`,
          },
        ];
      });

      const criadas = [];

      try {
        for (const movimentacao of movimentacoes) {
          criadas.push(
            await pb.collection(COLECAO_MOVIMENTACOES).create(movimentacao),
          );
        }
      } catch (error) {
        await Promise.all(
          criadas.map((movimentacao) =>
            pb.collection(COLECAO_MOVIMENTACOES).delete(movimentacao.id),
          ),
        );

        throw error;
      }

      return { sucesso: true };
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  }

  static async solicitarSaque(autorId, valorSaque) {
    const valorSolicitado = Number(valorSaque);
    const valorEmCentavos = valorSolicitado * 100;

    if (
      !Number.isFinite(valorSolicitado) ||
      valorSolicitado <= 0 ||
      !Number.isSafeInteger(Math.round(valorEmCentavos)) ||
      Math.abs(valorEmCentavos - Math.round(valorEmCentavos)) >
        Number.EPSILON * Math.max(1, Math.abs(valorEmCentavos)) * 4
    ) {
      const error = new Error(
        "Informe um valor de saque válido, com até duas casas decimais.",
      );
      error.statusCode = 400;
      throw error;
    }

    const dadosBancarios = await this.buscarDadosBancarios(autorId);

    if (
      !dadosBancarios ||
      typeof dadosBancarios !== "object" ||
      Array.isArray(dadosBancarios) ||
      !dadosBancarios.nome_completo ||
      !dadosBancarios.numero_banco ||
      !dadosBancarios.numero_agencia ||
      !dadosBancarios.numero_conta ||
      !dadosBancarios.tipo_conta
    ) {
      const error = new Error(
        "Cadastre todos os dados bancários antes de solicitar um saque.",
      );
      error.statusCode = 400;
      throw error;
    }

    const infoFinanceira = await this.buscarDadosMovimentacoesAutor(autorId);

    if (infoFinanceira.saldo < valorSolicitado) {
      const error = new Error(
        `Saldo insuficiente. Saldo disponível: R$ ${infoFinanceira.saldo.toFixed(2).replace(".", ",")}.`,
      );
      error.statusCode = 400;
      throw error;
    }

    const pb = criarClienteModel();

    try {
      const transacao = await pb.collection(COLECAO_MOVIMENTACOES).create({
        data: new Date().toISOString(),
        [RELACAO_PERFIL]: autorId,
        [RELACAO_VENDA]: "",
        tipo: "saida",
        valor: valorSolicitado,
        descricao: "Saque de saldo de direitos autorais para conta bancária.",
        status: "concluido",
        dados_bancarios: dadosBancarios,
      });

      return {
        mensagem: "Saque realizado com sucesso!",
        transacao,
        novoSaldo:
          Math.round((infoFinanceira.saldo - valorSolicitado) * 100) / 100,
      };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarDadosBancarios(userId) {
    const pb = criarClienteModel();
    const perfil = await buscarPerfil(pb, userId);

    return perfil?.dados_bancarios || null;
  }
}
