import styles from "./Popup.module.css";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

export default function Popup({ tipo, mensagem, fechar }) {
  const sucesso = tipo === "sucesso";

  return (
    <div className={styles.container}>
      <div
        className={`${styles.popup} ${sucesso ? styles.sucesso : styles.erro}`}
      >
        <button className={styles.fechar} onClick={fechar} type="button">
          <FaTimes />
        </button>

        <div className={styles.icone}>
          {sucesso ? <FaCheckCircle /> : <FaTimesCircle />}
        </div>

        <h3>{sucesso ? "Sucesso!" : "Erro!"}</h3>

        <p>{mensagem}</p>

        <button className={styles.btnOk} onClick={fechar} type="button">
          OK
        </button>
      </div>
    </div>
  );
}
