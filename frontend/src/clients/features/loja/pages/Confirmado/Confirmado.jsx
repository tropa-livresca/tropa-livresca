import styles from "./Confirmado.module.css";
import { FaCheckCircle } from "react-icons/fa";

export default function Confirmado() {
  return (
    <div className={styles.container}>
      <div className={styles.popup}>
        <div className={styles.containerconf}>
          <div className={styles.icone}>
            <FaCheckCircle />
          </div>

          <h3>Pagamento confirmado!</h3>

          <p>
            Obrigado pela sua compra, David Balls. <br/>O pagamento do pedido  
            <span className={styles.numero}> #6767</span> foi aprovado com
            sucesso.
          </p>

          <p>
            
          </p>

          <button className={styles.btn} type="button">
            Voltar a pagina inicial
          </button>
        </div>
      </div>
    </div>
  );
}
