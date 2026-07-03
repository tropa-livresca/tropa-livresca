import styles from "./Paginacao.module.css";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Paginacao({ paginaAtual, totalPaginas, totalItems, onMudarPagina }) {
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
        <span className={styles.pagina}>Página {paginaAtual} de {totalPaginas}</span>
        {totalItems != null && (
          <span className={styles.total}>(Total: {totalItems})</span>
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
