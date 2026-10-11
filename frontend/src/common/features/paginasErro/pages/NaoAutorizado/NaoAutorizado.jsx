import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import { useState, useEffect } from "react";
import styles from "../NotFound/NotFound.module.css";
import useAdmin from "../../../../hooks/useAdmin.js";

export default function NaoAutorizado({
  mensagem = "Você não tem permissão para acessar esta página. Se acha que isso é um engano, fale com um administrador master.",
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { signed, loading } = useAdmin();

  const noAdmin = pathname.startsWith("/admin");
  const [destino, setDestino] = useState("/");

  useEffect(() => {
    if (loading) return;

    if (noAdmin) {
      setDestino(signed ? "/admin" : "/auth/admin");
    } else {
      setDestino("/");
    }
  }, [noAdmin, signed, loading]);

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
        <Link to={destino} className={styles.botaoPrincipal}>
          <FiHome />
          {noAdmin
            ? signed
              ? "Ir para o painel"
              : "Fazer login"
            : "Ir para o início"}
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
