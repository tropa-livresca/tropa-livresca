import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiDownload, FiFileText } from "react-icons/fi";
import { jsPDF } from "jspdf";

import BotaoComprar from "../../components/BotaoComprar/BotaoComprar";
import { useCarrinho } from "../../hooks/useCarrinho";

import styles from "./PagamentoBoleto.module.css";

const DIAS_UTEIS_VENCIMENTO = 3;

function adicionarDiasUteis(dataInicial, quantidade) {
  const data = new Date(dataInicial);
  let diasAdicionados = 0;

  while (diasAdicionados < quantidade) {
    data.setDate(data.getDate() + 1);

    const diaSemana = data.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) {
      diasAdicionados++;
    }
  }

  return data;
}

function formatarData(data) {
  return data.toLocaleDateString("pt-BR");
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function criarReferencia(pedidoId) {
  const identificador = String(pedidoId)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(-12);

  return `TL-DEMO-${identificador || "PEDIDO"}`;
}

export default function PagamentoBoleto() {
  const location = useLocation();
  const navigate = useNavigate();

  const pedido = location.state?.pedido;
  const frete = Number(location.state?.frete ?? pedido?.frete ?? 0);

  const { limparCarrinho, pagarPedido } = useCarrinho();

  const [mensagem, setMensagem] = useState("");
  const [erroLocal, setErroLocal] = useState("");
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [confirmandoPagamento, setConfirmandoPagamento] = useState(false);

  const vencimento = useMemo(
    () => adicionarDiasUteis(new Date(), DIAS_UTEIS_VENCIMENTO),
    [],
  );

  const valorTotal = Number(pedido?.total ?? 0);
  const referencia = pedido?.id ? criarReferencia(pedido.id) : "";

  const pedidoValido =
    Boolean(pedido?.id) &&
    Number.isFinite(valorTotal) &&
    valorTotal > 0 &&
    Number.isFinite(frete) &&
    frete >= 0;

  async function gerarPDFBoleto() {
    if (!pedidoValido || gerandoPdf) return;

    setErroLocal("");
    setMensagem("");
    setGerandoPdf(true);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const largura = 210;
      const margem = 12;
      const larguraUtil = largura - margem * 2;
      const pedidoId = String(pedido.id);
      const dataEmissao = new Date();
      const dataVencimento = new Date(vencimento);

      const texto = (valor) => String(valor ?? "Não informado");

      function caixa(x, y, w, h, titulo, valor, opcoes = {}) {
        pdf.setDrawColor(100, 100, 100);
        pdf.setLineWidth(0.2);
        pdf.rect(x, y, w, h);

        pdf.setTextColor(75, 85, 99);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        pdf.text(titulo.toUpperCase(), x + 2, y + 4);

        pdf.setTextColor(35, 48, 65);
        pdf.setFont("helvetica", opcoes.negrito ? "bold" : "normal");
        pdf.setFontSize(opcoes.tamanho || 10);

        const linhas = pdf.splitTextToSize(texto(valor), w - 4);
        pdf.text(linhas, x + 2, y + 10);
      }

      // Cabeçalho com identificação visual do documento.
      pdf.setFillColor(245, 247, 250);
      pdf.rect(0, 0, largura, 32, "F");

      pdf.setTextColor(35, 48, 65);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(19);
      pdf.text("TROPA LIVRESCA", margem, 12);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text("DOCUMENTO DE PAGAMENTO", margem, 18);
      pdf.setFontSize(7);
      pdf.text("Emissão demonstrativa para ambiente acadêmico", margem, 24);

      pdf.setFillColor(170, 35, 35);
      pdf.roundedRect(123, 6, 75, 10, 1.5, 1.5, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("FICTÍCIO — NÃO PAGÁVEL", 160.5, 12.3, {
        align: "center",
      });

      pdf.setTextColor(35, 48, 65);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text(`Referência: ${referencia}`, largura - margem, 25, {
        align: "right",
      });

      // Beneficiário e identificação.
      let y = 38;

      caixa(margem, y, 112, 16, "Beneficiário", "Tropa Livresca", {
        negrito: true,
      });
      caixa(margem + 114, y, larguraUtil - 114, 16, "Referência", referencia, {
        negrito: true,
        tamanho: 8,
      });

      y += 18;

      // Data de emissão, vencimento e valor total.
      const espacamento = 2;
      const w1 = 42;
      const w2 = 42;
      const w3 = larguraUtil - w1 - w2 - espacamento * 2;

      caixa(margem, y, w1, 16, "Data de emissão", formatarData(dataEmissao));
      caixa(
        margem + w1 + espacamento,
        y,
        w2,
        16,
        "Vencimento",
        formatarData(dataVencimento),
        { negrito: true },
      );
      caixa(
        margem + w1 + w2 + espacamento * 2,
        y,
        w3,
        16,
        "Valor do documento",
        formatarMoeda(valorTotal),
        { negrito: true, tamanho: 12 },
      );

      y += 18;
      caixa(margem, y, larguraUtil, 16, "Número do pedido", pedidoId);

      y += 18;
      caixa(
        margem,
        y,
        larguraUtil,
        16,
        "Pagador",
        pedido.nome_comprador || pedido.nome || "Comprador da simulação",
        { negrito: true },
      );

      // Discriminação da compra.
      y += 22;
      pdf.setTextColor(35, 48, 65);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("DISCRIMINAÇÃO DA COMPRA", margem, y);

      y += 4;
      pdf.setDrawColor(100, 100, 100);
      pdf.rect(margem, y, larguraUtil, 21);
      pdf.setTextColor(45, 55, 65);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(
        "Compra de livros pela plataforma Tropa Livresca.",
        margem + 3,
        y + 7,
      );
      pdf.text(
        `Valor total demonstrativo: ${formatarMoeda(valorTotal)}`,
        margem + 3,
        y + 13,
      );
      pdf.setFontSize(7);
      pdf.text(
        "Valor ilustrativo; não representa cobrança bancária real.",
        margem + 3,
        y + 18,
      );

      // Instruções de uso.
      y += 27;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("INSTRUÇÕES", margem, y);
      y += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      const instrucoes = [
        "1. Este documento foi gerado para fins de demonstração.",
        "2. Não utilize este documento para efetuar pagamentos.",
        "3. Não existe registro de cobrança em instituição bancária.",
        "4. A confirmação ocorre exclusivamente no ambiente simulado.",
      ];
      instrucoes.forEach((linha, indice) => {
        pdf.text(linha, margem, y + indice * 5);
      });

      // Separação visual da ficha de compensação.
      y += 26;
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(40, 40, 40);
      pdf.setLineDashPattern([2, 2], 0);
      pdf.line(margem, y, largura - margem, y);
      pdf.setLineDashPattern([], 0);

      y += 7;
      pdf.setFillColor(235, 238, 242);
      pdf.rect(margem, y - 5, larguraUtil, 10, "F");
      pdf.setTextColor(35, 48, 65);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("FICHA DE COMPENSAÇÃO — DEMONSTRATIVA", margem + 3, y + 1);

      y += 8;
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margem, y, larguraUtil, 16, "F");
      pdf.setTextColor(170, 35, 35);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("LINHA DIGITÁVEL FICTÍCIA", margem + 3, y + 6);
      pdf.setFont("courier", "normal");
      pdf.setFontSize(9);
      pdf.text("SEM VALIDADE BANCÁRIA", margem + 3, y + 12);

      y += 22;
      caixa(margem, y, 75, 16, "Beneficiário", "Tropa Livresca");
      caixa(
        margem + 77,
        y,
        larguraUtil - 77,
        16,
        "Valor do documento",
        formatarMoeda(valorTotal),
        { negrito: true },
      );

      y += 23;
      pdf.setTextColor(170, 35, 35);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("DOCUMENTO FICTÍCIO — NÃO PAGÁVEL", largura / 2, y, {
        align: "center",
      });
      pdf.setTextColor(70, 70, 70);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text(
        "Tropa Livresca • Pagamento exclusivamente simulado",
        largura / 2,
        y + 6,
        { align: "center" },
      );

      pdf.save(`boleto-demonstrativo-${pedidoId}.pdf`);
      setMensagem("PDF demonstrativo gerado com sucesso.");
    } catch (erro) {
      console.error("[PagamentoBoleto] Erro ao gerar PDF:", erro);
      setErroLocal("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      setGerandoPdf(false);
    }
  }

  async function handleEmitirBoleto() {
    setErroLocal("");
    setMensagem("");

    if (!pedidoValido) {
      setErroLocal(
        "Pedido inválido. Volte ao checkout e confira os dados da compra.",
      );
      return;
    }

    if (confirmandoPagamento) return;
    setConfirmandoPagamento(true);

    try {
      const pago = await pagarPedido(pedido.id);

      if (!pago) {
        setErroLocal(
          "Não foi possível confirmar o pagamento simulado do pedido.",
        );
        return;
      }

      limparCarrinho();

      navigate(`/pedido/${pedido.id}`, {
        replace: true,
        state: {
          pedido: {
            ...pedido,
            status_pagamento: "pago",
          },
          frete,
          formaPagamento: "boleto",
          pagamentoDemonstrativo: true,
          statusPagamento: "pago",
          referenciaBoleto: referencia,
          vencimentoBoleto: vencimento.toISOString(),
        },
      });
    } catch (erro) {
      console.error(
        "[PagamentoBoleto] Erro ao confirmar pagamento simulado:",
        erro,
      );
      setErroLocal(
        "Ocorreu um erro ao confirmar o pagamento simulado. Tente novamente.",
      );
    } finally {
      setConfirmandoPagamento(false);
    }
  }

  const pagamentoConfirmado = location.state?.statusPagamento === "pago";

  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <Link to="/checkout" className={styles.voltar}>
          <FiArrowLeft />
          Voltar para o pagamento
        </Link>
      </div>

      <section className={styles.formPagamento}>
        <div className={styles.formTitulo}>
          <div className={styles.icone}>
            <FiFileText />
          </div>

          <div>
            <strong>Boleto bancário demonstrativo</strong>
            <span>Documento fictício para simulação da compra.</span>
          </div>
        </div>

        {!pedidoValido && (
          <p role="alert" className={styles.erro}>
            Pedido ou valor inválido. Volte ao checkout para conferir a compra.
          </p>
        )}

        <div className={styles.informacoes}>
          <div>
            <span>Valor total do pedido</span>
            <strong className={styles.numero}>
              {formatarMoeda(valorTotal)}
            </strong>
          </div>

          <div>
            <span>Frete</span>
            <strong>{formatarMoeda(frete)}</strong>
          </div>

          <div>
            <span>Vencimento demonstrativo</span>
            <strong>{formatarData(vencimento)}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>
              {pagamentoConfirmado
                ? "Pago (simulação)"
                : "Aguardando confirmação"}
            </strong>
          </div>
        </div>

        <div className={styles.codigo}>
          <div>
            <span>Referência demonstrativa</span>
            <strong className={styles.numero}>
              {referencia || "Indisponível"}
            </strong>
          </div>
        </div>

        <button
          type="button"
          className={styles.botao}
          onClick={gerarPDFBoleto}
          disabled={!pedidoValido || gerandoPdf}
        >
          <FiDownload />
          {gerandoPdf ? "Gerando PDF..." : "Baixar boleto demonstrativo (PDF)"}
        </button>

        {mensagem && (
          <p role="status" className={styles.sucesso}>
            {mensagem}
          </p>
        )}

        {erroLocal && (
          <p role="alert" className={styles.erro}>
            {erroLocal}
          </p>
        )}

        <div className={styles.aviso}>
          <strong>Importante</strong>
          <p>
            Este documento é fictício. O vencimento é estimado em três dias
            úteis, sem considerar feriados. Não existe código de barras ou linha
            digitável válida, e o documento não pode ser utilizado para realizar
            um pagamento real.
          </p>
        </div>

        <BotaoComprar
          pedido={pedido}
          handleConfirmar={() => {}}
          handlePagar={handleEmitirBoleto}
          carregando={confirmandoPagamento}
          formaPagamento="boleto"
          className={styles.botao}
        />
      </section>
    </main>
  );
}
