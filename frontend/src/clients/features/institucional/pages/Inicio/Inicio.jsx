import styles from "./Inicio.module.css";

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
    </section>
  );
}
