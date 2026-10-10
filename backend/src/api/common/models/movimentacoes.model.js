import { supabaseAdmin } from "../config/supabase.js";

// Parte do valor de cada venda repassada ao autor do livro.
const PERCENTUAL_AUTOR = 0.3;

export class MovimentacoesModel {
  static async criarConta(usuarioId, dadosBancarios) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .update({
        dados_bancarios: dadosBancarios,
      })
      .eq("id", usuarioId)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async alterarDadosConta(usuarioId, novosDadosBancarios) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .update({
        dados_bancarios: novosDadosBancarios,
      })
      .eq("id", usuarioId)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async buscarDadosMovimentacoesAutor(autorId) {
    const { data, error } = await supabaseAdmin
      .from("movimentacoes_financeiras")
      .select("*")
      .eq("fk_user_profile_id", autorId)
      .eq("status", "concluido")
      .order("data", { ascending: false });

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    const saldo = (data || []).reduce((acc, mov) => {
      const valor = Number(mov.valor);
      return mov.tipo === "entrada" ? acc + valor : acc - valor;
    }, 0);

    return {
      extrato: data || [],
      saldo: Math.round(saldo * 100) / 100,
    };
  }

  static async buscarDadosMovimentacoesEditora() {
    const { data, error } = await supabaseAdmin
      .from("movimentacoes_financeiras")
      .select("*")
      .is("fk_user_profile_id", null)
      .eq("status", "concluido")
      .order("data", { ascending: false });

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    const somar = (tipo) =>
      (data || [])
        .filter((mov) => mov.tipo === tipo)
        .reduce((acc, mov) => acc + Number(mov.valor), 0);

    const totalVendas = somar("entrada");
    const totalRepassado = somar("saida");
    const arredondar = (valor) => Math.round(valor * 100) / 100;

    return {
      extrato: data || [],
      totalVendas: arredondar(totalVendas),
      totalRepassado: arredondar(totalRepassado),
      saldoTotalCaixa: arredondar(totalVendas - totalRepassado),
    };
  }

  static async autorizarDepositoContaAutor(vendaId) {
    try {
      const { data: venda, error: erroVenda } = await supabaseAdmin
        .from("vendas")
        .select("id, status_pagamento")
        .eq("id", vendaId)
        .maybeSingle();

      if (erroVenda) throw erroVenda;

      if (!venda) {
        const erro = new Error("Venda não encontrada.");
        erro.statusCode = 404;
        throw erro;
      }

      if (venda.status_pagamento !== "pago") {
        const erro = new Error(
          "O repasse só pode ser autorizado para vendas pagas.",
        );
        erro.statusCode = 400;
        throw erro;
      }

      const { data: repasseExistente, error: erroRepasse } = await supabaseAdmin
        .from("movimentacoes_financeiras")
        .select("id")
        .eq("fk_vendas_id", vendaId)
        .limit(1);

      if (erroRepasse) throw erroRepasse;

      if (repasseExistente.length > 0) {
        const erro = new Error("O repasse desta venda já foi autorizado.");
        erro.statusCode = 409;
        throw erro;
      }

      const { data: itens, error: erroItens } = await supabaseAdmin
        .from("itens_venda")
        .select(
          `
          subtotal,
          livros (
            fk_user_profile_id
          )
        `,
        )
        .eq("fk_vendas_id", vendaId);

      if (erroItens || !itens || itens.length === 0) {
        const erro = new Error(
          "Itens da venda não encontrados para realizar o depósito.",
        );
        erro.statusCode = 404;
        throw erro;
      }

      const data = new Date().toISOString();
      const movimentacoes = [];

      for (const item of itens) {
        const valorTotalItem = Number(item.subtotal);
        const autorId = item.livros.fk_user_profile_id;

        const comissaoAutor =
          Math.round(valorTotalItem * PERCENTUAL_AUTOR * 100) / 100;

        movimentacoes.push(
          {
            data,
            status: "concluido",
            fk_user_profile_id: null,
            fk_vendas_id: vendaId,
            tipo: "entrada",
            valor: valorTotalItem,
            descricao: `Venda bruta registrada no sistema para o pedido #${vendaId}`,
          },
          {
            data,
            status: "concluido",
            fk_user_profile_id: null,
            fk_vendas_id: vendaId,
            tipo: "saida",
            valor: comissaoAutor,
            descricao: `Split de repasse de direitos autorais enviado ao autor da venda #${vendaId}`,
          },
          {
            data,
            status: "concluido",
            fk_user_profile_id: autorId,
            fk_vendas_id: vendaId,
            tipo: "entrada",
            valor: comissaoAutor,
            descricao: `Crédito de direitos autorais recebidos pelo pedido #${vendaId}`,
          },
        );
      }

      const { error: erroInsert } = await supabaseAdmin
        .from("movimentacoes_financeiras")
        .insert(movimentacoes);

      if (erroInsert) throw erroInsert;

      return { sucesso: true };
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  }

  static async solicitarSaque(autorId, valorSaque) {
    const valorSolicitado = Number(valorSaque);

    if (
      !Number.isFinite(valorSolicitado) ||
      valorSolicitado <= 0 ||
      Math.round(valorSolicitado * 100) !== valorSolicitado * 100
    ) {
      const erro = new Error(
        "Informe um valor de saque válido, com até duas casas decimais.",
      );
      erro.statusCode = 400;
      throw erro;
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
      const erro = new Error(
        "Cadastre todos os dados bancários antes de solicitar um saque.",
      );
      erro.statusCode = 400;
      throw erro;
    }

    const infoFinanceira = await this.buscarDadosMovimentacoesAutor(autorId);

    if (infoFinanceira.saldo < valorSolicitado) {
      const erro = new Error(
        `Saldo insuficiente. Saldo disponível: R$ ${infoFinanceira.saldo.toFixed(2).replace(".", ",")}.`,
      );
      erro.statusCode = 400;
      throw erro;
    }

    const { data, error } = await supabaseAdmin
      .from("movimentacoes_financeiras")
      .insert({
        data: new Date().toISOString(),
        fk_user_profile_id: autorId,
        fk_vendas_id: null,
        tipo: "saida",
        valor: valorSolicitado,
        descricao: "Saque de saldo de direitos autorais para conta bancária.",
        status: "concluido",
        dados_bancarios: dadosBancarios,
      })
      .select()
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    const novoSaldo =
      Math.round((infoFinanceira.saldo - valorSolicitado) * 100) / 100;

    return {
      mensagem: "Saque realizado com sucesso!",
      transacao: data,
      novoSaldo,
    };
  }

  static async buscarDadosBancarios(userId) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .select("dados_bancarios")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data?.dados_bancarios || null;
  }
}
