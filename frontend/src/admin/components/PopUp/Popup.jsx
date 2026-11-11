import styles from "./Popup.module.css";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

export default function Popup({
  tipo,
  mensagem,
  fechar,
  confirmar,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
}) {
  const sucesso = tipo === "sucesso";
  const ehConfirmacao = typeof confirmar === "function";

  return (
    <div className={styles.container}>
      <div
        className={`${styles.popup} ${sucesso ? styles.sucesso : styles.erro}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-titulo"
      >
        <button className={styles.fechar} onClick={fechar} type="button">
          <FaTimes />
        </button>

        <div className={styles.icone}>
          {sucesso ? <FaCheckCircle /> : <FaTimesCircle />}
        </div>

        <h3 id="popup-titulo">
          {ehConfirmacao ? "Confirmar ação" : sucesso ? "Sucesso!" : "Erro!"}
        </h3>

        <p>{mensagem}</p>

        {ehConfirmacao ? (
          <div className={styles.acoes}>
            <button
              className={styles.btnCancelar}
              onClick={fechar}
              type="button"
            >
              {textoCancelar}
            </button>
            <button
              className={`${styles.btnOk} ${styles.btnConfirmar}`}
              onClick={() => {
                fechar();
                confirmar();
              }}
              type="button"
            >
              {textoConfirmar}
            </button>
          </div>
        ) : (
          <button className={styles.btnOk} onClick={fechar} type="button">
            OK
          </button>
        )}
      </div>
    </div>
  );
}
