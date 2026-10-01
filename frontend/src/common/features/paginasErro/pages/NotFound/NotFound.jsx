import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import styles from "./NotFound.module.css";

export default function NotFound() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // No painel do admin, "início" é o painel; no resto, a página inicial.
  const noAdmin = pathname.startsWith("/admin/") || pathname === "/admin";
  const inicio = noAdmin ? "/admin" : "/";

  return (
    <main className={styles.pagina}>
      <img
        src="/logo404.jpeg"
        alt="Mula da Tropa Livresca com livros caídos no chão"
        className={styles.logo}
      />

      <p className={styles.codigo}>404</p>
      <h1 className={styles.titulo}>Página não encontrada</h1>
      <p className={styles.texto}>
        Parece que a tropa derrubou alguns livros pelo caminho e esta página
        ficou para trás. Confira o endereço ou volte para um lugar conhecido.
      </p>

      <div className={styles.acoes}>
        <Link to={inicio} className={styles.botaoPrincipal}>
          <FiHome /> {noAdmin ? "Ir para o painel" : "Ir para o início"}
        </Link>
        <button
          type="button"
          className={styles.botaoSecundario}
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft /> Voltar
        </button>
      </div>
    </main>
  );
}
