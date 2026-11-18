import styles from "./Avaliacao.module.css";

export default function ResumoAvaliacao({ media = 0, total = 0 }) {
  if (total === 0) {
    return (
      <div className={styles.resumo}>
        <span className={styles.estrelasVazias} aria-hidden="true">
          ★★★★★
        </span>
        <span className={styles.semAvaliacao}>Ainda sem avaliações</span>
      </div>
    );
  }

  const cheias = Math.round(media);

  return (
    <div
      className={styles.resumo}
      aria-label={`Nota ${media} de 5, ${total} avaliações`}
    >
      <span aria-hidden="true">
        <span className={styles.estrelasCheias}>{"★".repeat(cheias)}</span>
        <span className={styles.estrelasVazias}>{"★".repeat(5 - cheias)}</span>
      </span>
      <strong className={styles.media}>
        {media.toFixed(1).replace(".", ",")}
      </strong>
      <span className={styles.total}>
        ({total} {total === 1 ? "avaliação" : "avaliações"})
      </span>
    </div>
  );
}
