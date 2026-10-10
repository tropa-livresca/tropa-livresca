import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCopy } from "react-icons/fi";
import { FaPix } from "react-icons/fa6";

import styles from "./PagamentoPix.module.css";
import BotaoComprar from "../../components/BotaoComprar/BotaoComprar";
import { useCompra } from "../../hooks/useCompra";
import { useCarrinho } from "../../hooks/useCarrinho";

const CHAVE_PIX = "davidballsdocumentacao@gmail.com";

const formatarPreco = (valor) =>
  `R$ ${Number(valor || 0)
    .toFixed(2)
    .replace(".", ",")}`;

export default function PagamentoPix() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const pedido = state?.pedido;
  const frete = Number(state?.frete || 0);

  const { pagarPedido, carregando, erro } = useCompra();
  const { limparCarrinho } = useCarrinho();

  const [copiado, setCopiado] = useState(false);
  const [erroLocal, setErroLocal] = useState("");

  const total = Number(pedido?.total || 0);

  async function handleCopiarChave() {
    try {
      await navigator.clipboard.writeText(CHAVE_PIX);
      setCopiado(true);
      setErroLocal("");

      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setErroLocal("Não foi possível copiar a chave Pix.");
    }
  }

  async function handlePagar() {
    setErroLocal("");

    if (!pedido?.id) {
      setErroLocal(
        "Pedido não encontrado. Volte ao checkout e tente novamente.",
      );
      return;
    }

    const pago = await pagarPedido(pedido.id);

    if (!pago) return;

    limparCarrinho();

    navigate(`/pedido/${pedido.id}`, {
      replace: true,
      state: {
        pedido,
        formaPagamento: "pix",
        pagamentoDemonstrativo: true,
      },
    });
  }

  if (!pedido?.id) {
    return (
      <main className={styles.container}>
        <p>Não foi possível localizar seu pedido.</p>

        <Link to="/pagamento" className={styles.voltar}>
          <FiArrowLeft />
          Voltar para o pagamento
        </Link>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <Link to="/pagamento" className={styles.voltar}>
          <FiArrowLeft />
          Voltar para o pagamento
        </Link>
      </div>

      <section className={styles.formPagamento}>
        <div className={styles.formTitulo}>
          <div className={styles.icone}>
            <FaPix />
          </div>

          <div>
            <strong>Pagamento via Pix</strong>
            <span>
              Confira o pedido e utilize a chave Pix para realizar o pagamento.
            </span>
          </div>
        </div>

        <div className={styles.resumoPedido}>
          <span>Pedido #{pedido.id}</span>
          <strong>{formatarPreco(total)}</strong>

          {frete > 0 && <span>Frete incluído no total do pedido.</span>}
        </div>

        <div className={styles.formulario}>
          <label>
            Chave Pix
            <div className={styles.chavePix}>
              <input
                type="text"
                value={CHAVE_PIX}
                readOnly
                aria-label="Chave Pix"
              />

              <button
                type="button"
                className={styles.botaoCopiar}
                onClick={handleCopiarChave}
                aria-label="Copiar chave Pix"
                title="Copiar chave Pix"
              >
                <FiCopy />
              </button>
            </div>
          </label>

          {copiado && (
            <p role="status" aria-live="polite">
              Chave Pix copiada com sucesso!
            </p>
          )}

          <div className={styles.qrCode}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                CHAVE_PIX,
              )}`}
              alt="QR Code contendo a chave Pix"
            />

            <span>Escaneie o QR Code pelo aplicativo do seu banco.</span>
          </div>

          <div className={styles.instrucoes}>
            <strong>Como pagar</strong>

            <div>
              <span className={styles.numero}>1</span>
              <p>Abra o aplicativo do seu banco.</p>
            </div>

            <div>
              <span className={styles.numero}>2</span>
              <p>Acesse a opção Pix.</p>
            </div>

            <div>
              <span className={styles.numero}>3</span>
              <p>Utilize a chave Pix para fazer a transferência.</p>
            </div>

            <div>
              <span className={styles.numero}>4</span>
              <p>Confira os dados e confirme a operação no banco.</p>
            </div>
          </div>

          {(erroLocal || erro) && (
            <p className={styles.erro} role="alert">
              {erroLocal || erro}
            </p>
          )}

          <BotaoComprar
            pedido={pedido}
            handleConfirmar={() => {}}
            handlePagar={handlePagar}
            carregando={carregando}
            formaPagamento="pix"
            className={styles.botao}
          />

          <span className={styles.seguro}>
            Pagamento demonstrativo. A operação utiliza a implementação de
            pagamento disponível no sistema.
          </span>
        </div>
      </section>
    </main>
  );
}
