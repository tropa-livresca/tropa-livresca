import styles from "./Inicio.module.css";


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
      <p>Publique seu projeto conosco!</p>
      <section></section>//Sessão para os autores
      <section></section>//Sessão para os livros da loja
      <section></section>//Sessão para os depoimentos
    </section>
  );
}
