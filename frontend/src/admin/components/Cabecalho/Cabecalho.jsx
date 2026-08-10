import styles from "./Cabecalho.module.css";
import { FaBars } from "react-icons/fa";

export default function Cabecalho({ aoAbrirMenu, signoutAdmin }) {
  return (
    <header className={styles.cabecalho}>
      <button className={styles.btnmenu} onClick={aoAbrirMenu}>
        <FaBars size={20}/>
      </button>

      <h1 className={styles.titulo}>Painel do Administrador</h1>

      <button className={styles.btnsair} onClick={signoutAdmin}>
        Sair
      </button>
    </header>
  );
}
