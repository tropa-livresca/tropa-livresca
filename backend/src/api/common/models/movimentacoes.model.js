import supabase from "../config/supabase.js";

export class MovimentacoesModel {
  static async criarConta(usuarioId, dadosBancarios) {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
    const { data, error } = await supabase
      .from("movimentacoes_financeiras")
      .select("*")
      .is("fk_user_profile_id", null)
      .eq("status", "concluido")
      .order("data", { ascending: false });

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    const saldoCaixa = (data || []).reduce((acc, mov) => {
      const valor = Number(mov.valor);
      return mov.tipo === "entrada" ? acc + valor : acc - valor;
    }, 0);

    return {
      extrato: data || [],
      saldoTotalCaixa: Math.round(saldoCaixa * 100) / 100,
    };
  }

  static async autorizarDepositoContaAutor(vendaId) {
    try {
      const { data: itens, error: erroItens } = await supabase
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

      for (const item of itens) {
        const valorTotalItem = Number(item.subtotal);
        const autorId = item.livros.fk_user_profile_id;

        const comissaoAutor = Math.round(valorTotalItem * 0.7 * 100) / 100;

        await supabase.from("movimentacoes_financeiras").insert({
          fk_user_profile_id: null,
          fk_vendas_id: vendaId,
          tipo: "entrada",
          valor: valorTotalItem,
          descricao: `Venda bruta registrada no sistema para o pedido #${vendaId}`,
        });

        await supabase.from("movimentacoes_financeiras").insert({
          fk_user_profile_id: null,
          fk_vendas_id: vendaId,
          tipo: "saida",
          valor: comissaoAutor,
          descricao: `Split de repasse de direitos autorais enviado ao autor da venda #${vendaId}`,
        });

        await supabase.from("movimentacoes_financeiras").insert({
          fk_user_profile_id: autorId,
          fk_vendas_id: vendaId,
          tipo: "entrada",
          valor: comissaoAutor,
          descricao: `Crédito de direitos autorais recebidos pelo pedido #${vendaId}`,
        });
      }

      return { sucesso: true };
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  }

  static async solicitarSaque(autorId, valorSaque) {
    const valorSolicitado = Number(valorSaque);
    if (isNaN(valorSolicitado) || valorSolicitado <= 0) {
      const erro = new Error(
        "O valor solicitado para saque deve ser maior que zero.",
      );
      erro.statusCode = 400;
      throw erro;
    }

    const infoFinanceira = await this.buscarDadosMovimentacoesAutor(autorId);

    if (infoFinanceira.saldo < valorSolicitado) {
      const erroSaldo = new Error(
        `Saldo insuficiente. Saldo disponível: R$ ${infoFinanceira.saldo}`,
      );
      erroSaldo.statusCode = 400;
      throw erroSaldo;
    }

    const { data, error } = await supabase
      .from("movimentacoes_financeiras")
      .insert({
        fk_user_profile_id: autorId,
        tipo: "saida",
        valor: valorSolicitado,
        descricao: "Saque de saldo de direitos autorais para conta bancária.",
        status: "concluido",
      })
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      mensagem: "Saque realizado com sucesso!",
      transacao: data,
      novoSaldo:
        Math.round((infoFinanceira.saldo - valorSolicitado) * 100) / 100,
    };
  }
}
