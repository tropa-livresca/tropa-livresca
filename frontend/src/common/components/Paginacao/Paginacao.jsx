import styles from "./Paginacao.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Paginacao({
  totalPaginas,
  paginaAtual,
  onMudarPagina,
  totalItems,
}) {
  if (!totalPaginas || totalPaginas <= 1) return null;

  return (
    <nav className={styles.paginacao} aria-label="Paginação">
      <button
        className={styles.btnpagina}
        onClick={() => onMudarPagina(Math.max(paginaAtual - 1, 1))}
        disabled={paginaAtual === 1}
      >
        <FaChevronLeft aria-hidden="true" />
        Anterior
      </button>

      <div className={styles.info}>
        <span className={styles.pagina}>
          Página <span className={styles.numero}>{paginaAtual}</span> de <span className={styles.numero}>{totalPaginas}</span>
        </span>
        {totalItems != null && (
          <span className={styles.total}>(Total: <span className={styles.numero}>{totalItems}</span>)</span>
        )}
      </div>

      <button
        className={styles.btnpagina}
        onClick={() => onMudarPagina(Math.min(paginaAtual + 1, totalPaginas))}
        disabled={paginaAtual === totalPaginas}
      >
        Próximo
        <FaChevronRight aria-hidden="true" />
      </button>
    </nav>
  );
}
