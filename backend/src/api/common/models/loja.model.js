import supabase from "../config/supabase.js";
import nodemailer from "nodemailer";

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
  conteudo_por_IA,
  direitos_de_publicacao
`;

export class LojaModel {
  static async buscarComFiltros({
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
    categoria = "",
  }) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from("livros")
      .select(COLUNAS_LIVRO, { count: "exact" })
      .eq("ativo", true)
      .eq("estado", "publicado");

    if (busca) {
      query = query.ilike("titulo", `%${busca}%`);
    }

    if (categoria) {
      query = query.ilike("categoria", categoria);
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
      .eq("estado", "publicado")
      .single();

    if (error) {
      error.statusCode = 404;
      throw error;
    }

    return data;
  }

  static async realizarVenda(dadosVenda) {
    const { data, error } = await supabase
      .from("vendas")
      .insert(dadosVenda)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async mudarStatusPagamento(vendaId, usuarioEmail) {
    const { data, error } = await supabase
      .from("vendas")
      .update({ status_pagamento: "pago" })
      .eq("id", vendaId)
      .select()
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    if (data && usuarioEmail) {
      this.enviarEbookAposPagamento(vendaId, usuarioEmail);
    }

    return data;
  }

  static async buscarHistoricoVendasUsuario(usuarioId) {
    const { data, error } = await supabase
      .from("vendas")
      .select("*, itens_venda(*)")
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
        formato,
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

  static async calcularFretePrazo(cepDestino, produtos) {
    const cepLimpo = cepDestino.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      const erroCep = new Error(
        "CEP de destino inválido. O CEP deve conter 8 dígitos.",
      );
      erroCep.statusCode = 400;
      throw erroCep;
    }

    let pesoTotalKg = 0;
    let possuiProdutoFisico = false;

    produtos.forEach((produto) => {
      if (produto.formato?.toLowerCase() === "fisico") {
        possuiProdutoFisico = true;
        const qtd = produto.qtd || 1;
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

  static async enviarEbookAposPagamento(vendaId, usuarioEmail) {
    try {
      const { data: itens, error } = await supabase
        .from("itens_venda")
        .select(
          `
          id,
          formato,
          livros (
            titulo,
            manuscrito
          )
        `,
        )
        .eq("fk_vendas_id", vendaId)
        .eq("formato", "digital");

      if (error || !itens || itens.length === 0) return;

      for (const item of itens) {
        const livro = item.livros;

        const dadosMail = {
          from: `"Sua Loja de Livros" <${process.env.SMTP_USER}>`,
          to: usuarioEmail,
          subject: `Seu E-book chegou: ${livro.titulo}! 📚`,
          text: `Olá! Seu pagamento foi confirmado. Aqui está o link/conteúdo do seu livro digital: ${livro.manuscrito}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2>Seu pagamento foi confirmado! 🎉</h2>
              <p>Olá! Obrigado pela sua compra na nossa plataforma.</p>
              <p>Você adquiriu a versão digital do livro <strong>${livro.titulo}</strong>.</p>
              <p>Clique no link abaixo para fazer o download ou acessar o manuscrito:</p>
              <a href="${livro.manuscrito}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Acessar Meu E-book</a>
            </div>
          `,
        };

        await this.dispararEmailcomLivroDigital(dadosMail);
      }
    } catch (error) {
      console.error("Falha ao enviar e-book por e-mail:", error);
    }
  }

  static async autorizarEntrega(vendaId) {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
}
