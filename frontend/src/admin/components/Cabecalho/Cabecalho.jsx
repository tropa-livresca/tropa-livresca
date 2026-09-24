import styles from "./Cabecalho.module.css";

export default function Cabecalho({ signoutAdmin }) {
  return (
    <header className={styles.cabecalho}>
      <h1 className={styles.titulo}>Painel do Administrador</h1>

      <button className={styles.btnsair} onClick={signoutAdmin}>
        Sair
      </button>
    </header>
  );
}