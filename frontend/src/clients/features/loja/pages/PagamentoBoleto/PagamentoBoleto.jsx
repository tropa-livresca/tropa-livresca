
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCopy, FiFileText } from "react-icons/fi";
import styles from "./PagamentoBoleto.module.css";

export default function PagamentoBoleto() {
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

        <p className={styles.descricao}>
          Utilize o código de barras abaixo para realizar o pagamento do seu
          pedido.
        </p>

        <div className={styles.informacoes}>
          <div>
            <span>Vencimento</span>
            <strong className={styles.numero}>3</strong> <strong>dias úteis</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>Aguardando pagamento</strong>
          </div>
        </div>

        <div className={styles.codigo}>
          <span className={styles.numero}>
            34191.79001 01043.510047 91020.150008 1 99990000010000
          </span>

          <button type="button">
            <FiCopy />
          </button>
        </div>

        <div className={styles.aviso}>
          <strong>Importante</strong>

          <p>
            O pagamento pode levar até <span className={styles.numero}>3</span> dias úteis para ser identificado após
            a realização.
          </p>
        </div>

        <button type="button" className={styles.botao}>
          Já realizei o pagamento
        </button>

        <span className={styles.seguro}>
          O pedido será atualizado após a confirmação do pagamento.
        </span>
      </section>
    </main>
  );
}
