import styles from "./Inicio.module.css";

import LinkButton from "../../components/layout/LinkButton/LinkButton";

/**
 * Página de Início em que se mostram as informações gerais da empresa 
 * Utiliza de métodos de pesquisa do banco de dados sem necessidade de login
 * 
 * @component
 * @returns {JSX.element}
 */
export default function Inicio() {

  return (
    <section className={styles.inicio_container}>
      <h1>Início</h1>
      <h2>
        Bem-vindo à <span>Tropa Livresca</span>
      </h2>
      <p>Comece a gerenciar os seus projetos agora mesmo!</p>

      <LinkButton to="/seautopublique" text="Se Autopublique" />
    </section>
  );
}
