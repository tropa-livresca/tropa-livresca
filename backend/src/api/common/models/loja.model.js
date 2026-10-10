import supabase, { supabaseAdmin } from "../config/supabase.js";
import nodemailer from "nodemailer";
import { LIVRO_ESTADO } from "../config/livro-estados.js";

const COLUNAS_LIVRO = `
  id,
  imagens_explicitas,
  data_de_publicacao,
  preco_digital,
  preco_fisico,
  autor_nome,
  autor_sobrenome,
  idioma,
  titulo,
  subtitulo,
  descricao,
  capa,
  ISBN,
  numero_edicao,
  direitos_de_publicacao
`;

function calcularPeriodo(periodo) {
  const agora = new Date();
  const fim = new Date(agora);
  let inicio = new Date(agora);

  switch (periodo) {
    case "7d":
      inicio.setDate(inicio.getDate() - 7);
      break;

    case "30d":
      inicio.setDate(inicio.getDate() - 30);
      break;

    case "90d":
      inicio.setDate(inicio.getDate() - 90);
      break;

    case "mes":
      inicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
      break;

    case "ano":
      inicio = new Date(agora.getFullYear(), 0, 1);
      break;

    default:
      throw new Error(`Período inválido: ${periodo}`);
  }

  return {
    inicio: inicio.toISOString(),
    fim: fim.toISOString(),
  };
}
export class LojaModel {
  static async buscarComFiltros({
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
    categoria = "",
    idioma = "",
  }) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from("livros")
      .select(COLUNAS_LIVRO, { count: "exact" })
      .eq("ativo", true)
      .eq("estado", LIVRO_ESTADO.PUBLICADO);

    if (busca) {
      query = query.ilike("titulo", `%${busca}%`);
    }

    if (categoria) {
      query = query.ilike("categoria", categoria);
    }

    if (idioma) {
      query = query.ilike("idioma", `%${idioma}%`);
    }

    if (filtro === "alfabetico") {
      query = query.order("titulo", {
        ascending: ordem !== "descendente",
      });
    } else if (filtro === "data") {
      query = query.order("data_de_publicacao", {
        ascending: ordem === "ascendente",
      });
    } else {
      query = query.order("titulo", {
        ascending: true,
      });
    }

    const { data, error, count } = await query.range(start, end);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data: data || [],
      count: count || 0,
    };
  }

  static async buscarLivroById(id) {
    const { data, error } = await supabase
      .from("livros")
      .select("*, users_profile(*)")
      .eq("id", id)
      .eq("ativo", true)
      .eq("estado", LIVRO_ESTADO.PUBLICADO)
      .single();

    if (error) {
      error.statusCode = 404;
      throw error;
    }

    return data;
  }

  static async consultarVendas({ page = 1, limit = 12, ordem = "" }) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabaseAdmin.from("vendas").select(
      `
        id, data, total, status_pagamento, status_entrega, endereco_entrega,
        users_profile(nome),
        itens_venda(qtd, fisico, subtotal, livros(titulo)),
        movimentacoes_financeiras(id)
      `,
      { count: "exact" },
    );

    query = query.order("data", { ascending: ordem === "ascendente" });

    const { data, error, count } = await query.range(start, end);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data: data || [],
      count: count || 0,
    };
  }

  static async consultarVenda(vendaId) {
    const { data, error } = await supabaseAdmin
      .from("vendas")
      .select("*")
      .eq("id", vendaId)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!data) {
      const erro = new Error("Venda não encontrada.");
      erro.statusCode = 404;
      throw erro;
    }

    const { data: itensVenda, error: erroItensVenda } = await supabaseAdmin
      .from("itens_venda")
      .select("*, livros(id, titulo, capa)")
      .eq("fk_vendas_id", vendaId);

    if (erroItensVenda) {
      erroItensVenda.statusCode = 500;
      throw erroItensVenda;
    }

    return {
      ...data,
      itensVenda,
    };
  }

  static async buscarLivrosParaVenda(livroIds) {
    const { data, error } = await supabase
      .from("livros")
      .select("id, titulo, preco_fisico, preco_digital")
      .in("id", livroIds)
      .eq("ativo", true)
      .eq("estado", LIVRO_ESTADO.PUBLICADO);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data || [];
  }

  static async realizarVenda(dadosVenda, itensVenda) {
    console.log(dadosVenda);

    const { data, error } = await supabaseAdmin
      .from("vendas")
      .insert(dadosVenda)
      .select("id")
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    const itens = itensVenda.map((itemVenda) => ({
      ...itemVenda,
      fk_vendas_id: data.id,
    }));

    const { error: erroItens } = await supabaseAdmin
      .from("itens_venda")
      .insert(itens);

    if (erroItens) {
      await supabaseAdmin.from("vendas").delete().eq("id", data.id);
      erroItens.statusCode = 500;
      throw erroItens;
    }

    return data;
  }

  static async mudarStatusPagamento(vendaId, usuarioEmail) {
    const { data, error } = await supabaseAdmin
      .from("vendas")
      .update({ status_pagamento: "pago" })
      .eq("id", vendaId)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!data) {
      const erro = new Error("Venda não encontrada.");
      erro.statusCode = 404;
      throw erro;
    }

    if (usuarioEmail) {
      try {
        await this.enviarEbookAposPagamento(vendaId, usuarioEmail);
      } catch (erroEmail) {
        // O pagamento continua confirmado mesmo se o e-mail falhar.
        console.error(
          `Falha no envio inicial dos e-books da venda ${vendaId}:`,
          erroEmail,
        );
      }
    }

    return data;
  }

  static async enviarEbookAposPagamento(vendaId, usuarioEmail) {
    if (!usuarioEmail) {
      const erro = new Error("E-mail do comprador não informado.");
      erro.statusCode = 400;
      throw erro;
    }

    const { data: venda, error: erroVenda } = await supabaseAdmin
      .from("vendas")
      .select("id, status_pagamento")
      .eq("id", vendaId)
      .maybeSingle();

    if (erroVenda) {
      erroVenda.statusCode = 500;
      throw erroVenda;
    }

    if (!venda) {
      const erro = new Error("Venda não encontrada.");
      erro.statusCode = 404;
      throw erro;
    }

    if (venda.status_pagamento !== "pago") {
      const erro = new Error(
        "Os livros digitais só podem ser enviados após a confirmação do pagamento.",
      );
      erro.statusCode = 400;
      throw erro;
    }

    const { data: itens, error } = await supabaseAdmin
      .from("itens_venda")
      .select(
        `
      id,
      fisico,
      livros (
        titulo,
        manuscrito
      )
    `,
      )
      .eq("fk_vendas_id", vendaId)
      .eq("fisico", false);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!itens || itens.length === 0) {
      const erro = new Error(
        "Este pedido não possui livros digitais para enviar.",
      );
      erro.statusCode = 400;
      throw erro;
    }

    let quantidadeEnviada = 0;

    for (const item of itens) {
      const livro = item.livros;

      if (!livro?.manuscrito) {
        throw new Error(
          `O arquivo digital de "${livro?.titulo || "um livro"}" não está disponível.`,
        );
      }

      const titulo = String(livro.titulo || "Livro digital");
      const link = String(livro.manuscrito);

      const dadosMail = {
        from: `"Tropa Livresca" <${process.env.SMTP_USER}>`,
        to: usuarioEmail,
        subject: `Seu livro digital: ${titulo}`,
        text: [
          "Olá!",
          "Este é o acesso ao livro digital adquirido na Tropa Livresca.",
          `Livro: ${titulo}`,
          `Acesso: ${link}`,
        ].join("\n\n"),
        html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #333;">
          <h2>Seu livro digital está disponível!</h2>
          <p>Olá! Obrigado por comprar na Tropa Livresca.</p>
          <p>
            Você adquiriu a versão digital de
            <strong>${titulo.replace(
              /[&<>"']/g,
              (c) =>
                ({
                  "&": "&amp;",
                  "<": "&lt;",
                  ">": "&gt;",
                  '"': "&quot;",
                  "'": "&#39;",
                })[c],
            )}</strong>.
          </p>
          <p>Utilize o botão abaixo para acessar o livro:</p>
          <a
            href="${link.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"
            style="display:inline-block;padding:12px 20px;background:#4F46E5;color:#fff;text-decoration:none;border-radius:6px;"
          >
            Acessar livro digital
          </a>
          <p style="margin-top:20px;font-size:13px;color:#666;">
            Guarde este e-mail para consultar o acesso novamente.
          </p>
        </div>
      `,
      };

      await this.dispararEmailcomLivroDigital(dadosMail);
      quantidadeEnviada++;
    }

    return {
      sucesso: true,
      quantidadeEnviada,
    };
  }

  static async reenviarEmailLivrosDigitais(vendaId, usuarioId, usuarioEmail) {
    const { data: venda, error } = await supabaseAdmin
      .from("vendas")
      .select("id, fk_user_profile_id, status_pagamento")
      .eq("id", vendaId)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!venda) {
      const erro = new Error("Pedido não encontrado.");
      erro.statusCode = 404;
      throw erro;
    }

    if (venda.fk_user_profile_id !== usuarioId) {
      const erro = new Error(
        "Você não tem permissão para reenviar os livros deste pedido.",
      );
      erro.statusCode = 403;
      throw erro;
    }

    if (venda.status_pagamento !== "pago") {
      const erro = new Error(
        "O e-mail só pode ser reenviado para pedidos pagos.",
      );
      erro.statusCode = 400;
      throw erro;
    }

    const resultado = await this.enviarEbookAposPagamento(
      vendaId,
      usuarioEmail,
    );

    return {
      mensagem: `E-mail reenviado com sucesso! ${resultado.quantidadeEnviada} livro(s) digital(is) enviado(s).`,
      quantidadeEnviada: resultado.quantidadeEnviada,
    };
  }
  static async buscarHistoricoVendasUsuario(usuarioId) {
    const { data, error } = await supabaseAdmin
      .from("vendas")
      .select("*, itens_venda(*, livros(titulo))")
      .eq("fk_user_profile_id", usuarioId)
      .order("data", { ascending: false });

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data: data || [],
      count: data?.length || 0,
    };
  }

  static async buscarNumeroVendasLivro(livroId) {
    const { data, error, count } = await supabase
      .from("itens_venda")
      .select(
        `
        id,
        vendas!inner(status_pagamento)
      `,
        { count: "exact" },
      )
      .eq("fk_livros_itens_id", livroId)
      .eq("vendas.status_pagamento", "pago");

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data,
      count: count || 0,
    };
  }

  static async buscarRelatorioFinanceiroAutor(autorId) {
    const { data, error } = await supabase
      .from("itens_venda")
      .select(
        `
        id,
        qtd,
        subtotal,
        fisico,
        vendas (
          id,
          data,
          status_pagamento
        ),
        livros!inner (
          id,
          titulo,
          fk_user_profile_id
        )
      `,
      )
      .eq("livros.fk_user_profile_id", autorId)
      .eq("vendas.status_pagamento", "pago");

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    const totalFaturado = (data || []).reduce(
      (acc, item) => acc + Number(item.subtotal),
      0,
    );

    return {
      vendas: data || [],
      totalFaturado,
      count: data?.length || 0,
    };
  }

  static async calcularFretePrazo(userId, produtos) {
    const { data, error } = await supabase
      .from("enderecos")
      .select("cep")
      .eq("fk_user_profile_id", userId)
      .eq("principal", true)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (!data) {
      const erro = new Error("CEP não encontrada.");
      erro.statusCode = 404;
      throw erro;
    }

    const cepLimpo = data.cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      const erroCep = new Error(
        "CEP de destino inválido. O CEP deve conter 8 dígitos.",
      );
      erroCep.statusCode = 400;
      throw erroCep;
    }

    let pesoTotalKg = 0;
    let possuiProdutoFisico = false;

    console.log(produtos);

    produtos.forEach((produto) => {
      if (produto.tipo?.toLowerCase() === "fisico") {
        possuiProdutoFisico = true;
        const qtd = produto.quantidade || 1;
        pesoTotalKg += qtd * 0.4;
      }
    });

    if (!possuiProdutoFisico) {
      return [
        {
          transportadora: "Plataforma",
          modalidade: "Download Digital",
          preco: 0.0,
          prazo_dias: 0,
          descricao: "Envio imediato por e-mail após aprovação do pagamento.",
        },
      ];
    }

    const digitoRegiao = parseInt(cepLimpo.charAt(0), 10);

    let precoBasePac;
    let precoBaseSedex;
    let multiplicadorPrazo;

    switch (digitoRegiao) {
      case 0:
      case 1: // São Paulo (Capital e Interior)
        precoBasePac = 12.9;
        precoBaseSedex = 18.5;
        multiplicadorPrazo = 1;
        break;
      case 2: // Rio de Janeiro e Espírito Santo
        precoBasePac = 16.2;
        precoBaseSedex = 24.9;
        multiplicadorPrazo = 2;
        break;
      case 3: // Minas Gerais
        precoBasePac = 15.5;
        precoBaseSedex = 23.0;
        multiplicadorPrazo = 2;
        break;
      case 4:
      case 7: // Nordeste e Centro-Oeste
        precoBasePac = 26.0;
        precoBaseSedex = 42.0;
        multiplicadorPrazo = 4;
        break;
      case 5:
      case 6: // Norte e Nordeste distante
        precoBasePac = 32.0;
        precoBaseSedex = 58.0;
        multiplicadorPrazo = 5;
        break;
      case 8:
      case 9: // Sul (PR, SC, RS)
        precoBasePac = 18.0;
        precoBaseSedex = 29.0;
        multiplicadorPrazo = 3;
        break;
      default:
        precoBasePac = 20.0;
        precoBaseSedex = 35.0;
        multiplicadorPrazo = 3;
    }

    const taxaPeso = pesoTotalKg * 3.5;

    return [
      {
        transportadora: "Correios",
        modalidade: "PAC",
        preco: Math.round((precoBasePac + taxaPeso) * 100) / 100,
        prazo_dias: 3 + multiplicadorPrazo * 2,
      },
      {
        transportadora: "Correios",
        modalidade: "SEDEX",
        preco: Math.round((precoBaseSedex + taxaPeso) * 100) / 100,
        prazo_dias: 1 + multiplicadorPrazo,
      },
    ];
  }

  static async dispararEmailcomLivroDigital(dadosMail) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "465", 10),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        family: 4,
      });

      return await transporter.sendMail(dadosMail);
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }

  static async autorizarEntrega(vendaId) {
    const { data, error } = await supabaseAdmin
      .from("vendas")
      .update({ status_entrega: "A caminho" })
      .eq("id", vendaId)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async alterarStatusEntrega(vendaId) {
    const { data, error } = await supabaseAdmin
      .from("vendas")
      .update({ status_entrega: "Entregue" })
      .eq("id", vendaId)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async obterEstatisticasVendas(periodo = "30d") {
    const { inicio, fim } = calcularPeriodo(periodo);

    const { data, error } = await supabaseAdmin.rpc(
      "relatorio_estatisticas_vendas",
      {
        p_inicio: inicio,
        p_fim: fim,
      },
    );

    if (error) {
      throw new Error(
        `Erro ao consultar estatísticas de vendas: ${error.message}`,
      );
    }

    return data;
  }
}
