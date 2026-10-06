import { Link } from "react-router-dom";
import { FiArrowLeft, FiCopy } from "react-icons/fi";
import { FaPix } from "react-icons/fa6";
import styles from "./PagamentoPix.module.css";

export default function PagamentoPix() {
  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <Link to="/pagamento" className={styles.voltar}>
          <FiArrowLeft />
          Voltar para o pagamento
        </Link>
      </div>

      <section className={styles.card}>
        <div className={styles.formTitulo}>
          <div className={styles.icone}>
            <FaPix />
          </div>

          <div>
            <strong>Pagamento via Pix</strong>
            <span>
              Copie a chave Pix abaixo ou escaneie o QR Code para fazer o
              pagamento pelo aplicativo do seu banco.
            </span>
          </div>
        </div>

        <div className={styles.chave}>
          <span>davidballsdocumentacao@gmail.com</span>

          <button type="button">
            <FiCopy />
          </button>
        </div>

        <div className={styles.qrCode}>
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=davidballsdocumentacao@gmail.com"
            alt="QR Code para pagamento via Pix"
          />

          <span>Escaneie o QR Code pelo aplicativo do seu banco</span>
        </div>

        <div className={styles.instrucoes}>
          <strong>Como pagar</strong>

          <div>
            <span className={styles.numero}>1</span>
            <p>Abra o aplicativo do seu banco.</p>
          </div>

          <div>
            <span className={styles.numero}>2</span>
            <p>Escolha a opção Pix.</p>
          </div>

          <div>
            <span className={styles.numero}>3</span>
            <p>Copie e cole a chave Pix ou escaneie o QR Code.</p>
          </div>

          <div>
            <span className={styles.numero}>4</span>
            <p>Confirme o pagamento.</p>
          </div>
        </div>

        <button type="button" className={styles.botao}>
          Já realizei o pagamento
        </button>

        <span className={styles.seguro}>
          O pagamento será confirmado após a identificação da transação.
        </span>
      </section>
    </main>
  );
}