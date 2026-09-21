import styles from "./Carregando.module.css";

export default function Carregando({ mensagem = "Carregando..." }) {
  return (
    <div className={styles.container}>
      <div className={styles.carregando}>
        <div className={styles.giro} />
        <p>{mensagem}</p>
      </div>
    </div>
  );
}
