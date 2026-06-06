import styles from "./Autores.module.css";

export default function Autores() {
  return (
    <main>
      <div className={styles.container}>
        <div className={styles.subtitulo}>
          <h4>
            A editora Tropa Livresca reúne autores independentes de todo o
            Brasil . Descubra escritores que compartilham histórias únicas,
            cheias de emoção e originalidade em suas obras. Autopublicação com
            qualidade editorial e reconhecimento!
          </h4>
        </div>
        <div className={styles.barrasearch}>
          <input
            type="text"
            placeholder="Pesquisar..."
            className={styles.inputsearch}
          />
          <button type="submit" className={styles.buttonsearch}>
            🔍
          </button>
        </div>
        <div className={styles.containerautores}>
          <div className={styles.l1}></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </main>
  );
}
