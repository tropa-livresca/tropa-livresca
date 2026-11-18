import styles from "./DescricaoTela.module.css";

export default function DescricaoTela({ titulo, descricao }) {
  return (
    <div className={styles.topo}>
      <h1 className={styles.titulo}>{titulo}</h1>
      <p>{descricao}</p>
    </div>
  );
}
