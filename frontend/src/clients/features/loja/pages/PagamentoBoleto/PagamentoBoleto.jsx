import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCopy, FiFileText } from "react-icons/fi";

import BotaoComprar from "../../components/BotaoComprar/BotaoComprar";
import { useCompra } from "../../hooks/useCompra";
import { useCarrinho } from "../../hooks/useCarrinho";

import styles from "./PagamentoBoleto.module.css";

const CODIGO_BOLETO = "34191.79001 01043.510047 91020.150008 1 99990000010000";

export default function PagamentoBoleto() {
  const location = useLocation();
  const navigate = useNavigate();

  const pedido = location.state?.pedido;
  const frete = Number(location.state?.frete || 0);

  const { pagarPedido, carregando, erro } = useCompra();
  const { limparCarrinho } = useCarrinho();

  const [mensagem, setMensagem] = useState("");
  const [erroLocal, setErroLocal] = useState("");

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(CODIGO_BOLETO);
      setMensagem("Código de barras copiado!");
      setErroLocal("");
    } catch {
      setErroLocal(
        "Não foi possível copiar automaticamente. Selecione e copie o código manualmente.",
      );
      setMensagem("");
    }
  };

  const handlePagar = async () => {
    setErroLocal("");
    setMensagem("");

    if (!pedido?.id) {
      setErroLocal(
        "Pedido não encontrado. Volte ao checkout e finalize a compra novamente.",
      );
      return;
    }

    try {
      const pago = await pagarPedido(pedido.id);

      if (!pago) {
        setErroLocal(
          "Não foi possível processar a confirmação demonstrativa do pedido.",
        );
        return;
      }

      limparCarrinho();

      navigate(`/pedido/${pedido.id}`, {
        replace: true,
        state: {
          pedido,
          frete,
          formaPagamento: "boleto",
          pagamentoDemonstrativo: true,
          statusPagamento: "aguardando_confirmacao",
        },
      });
    } catch {
      setErroLocal("Ocorreu um erro ao processar o pedido. Tente novamente.");
    }
  };

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
            <strong>Boleto bancário</strong>
            <span>Utilize o código de barras para realizar o pagamento.</span>
          </div>
        </div>

        {!pedido?.id && (
          <p role="alert" className={styles.erro}>
            Pedido não encontrado. Volte ao checkout para iniciar a compra.
          </p>
        )}

        <p className={styles.descricao}>
          Copie o código de barras abaixo para utilizá-lo no aplicativo ou
          internet banking da sua instituição financeira.
        </p>

        <div className={styles.informacoes}>
          <div>
            <span>Vencimento</span>
            <strong className={styles.numero}>3</strong>{" "}
            <strong>dias úteis</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>Aguardando pagamento</strong>
          </div>
        </div>

        <div className={styles.codigo}>
          <span className={styles.numero}>{CODIGO_BOLETO}</span>

          <button
            type="button"
            onClick={handleCopiar}
            aria-label="Copiar código de barras"
            title="Copiar código de barras"
          >
            <FiCopy />
          </button>
        </div>

        {mensagem && (
          <p role="status" className={styles.sucesso}>
            {mensagem}
          </p>
        )}

        {(erroLocal || erro) && (
          <p role="alert" className={styles.erro}>
            {erroLocal || erro}
          </p>
        )}

        <div className={styles.aviso}>
          <strong>Importante</strong>

          <p>
            A identificação de um boleto pode levar até{" "}
            <span className={styles.numero}>3</span> dias úteis após o
            pagamento. Nesta versão, a confirmação é demonstrativa: o código
            exibido não representa um boleto emitido para este pedido.
          </p>
        </div>

        <BotaoComprar
          pedido={pedido}
          handleConfirmar={() => {}}
          handlePagar={handlePagar}
          carregando={carregando}
          formaPagamento="boleto"
          className={styles.botao}
        />

        <span className={styles.seguro}>
          Em uma integração real, o pedido só deverá ser marcado como pago após
          a confirmação do banco ou do provedor de pagamentos.
        </span>
      </section>
    </main>
  );
}
