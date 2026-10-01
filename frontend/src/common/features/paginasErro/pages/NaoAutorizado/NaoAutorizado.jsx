import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import styles from "../NotFound/NotFound.module.css";

export default function NaoAutorizado({
  mensagem = "Você não tem permissão para acessar esta página. Se acha que isso é um engano, fale com um administrador master.",
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const noAdmin = pathname.startsWith("/admin/") || pathname === "/admin";
  const inicio = noAdmin ? "/admin" : "/";

  return (
    <main className={styles.pagina}>
      <img
        src="/logo404.jpeg"
        alt="Mula da Tropa Livresca com livros caídos no chão"
        className={styles.logo}
      />

      <p className={styles.codigo}>403</p>
      <h1 className={styles.titulo}>Acesso não autorizado</h1>
      <p className={styles.texto}>{mensagem}</p>

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
