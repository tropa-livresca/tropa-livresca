import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import usePerfil from "../../../hooks/usePerfil";
import { apiFetch } from "../../../services/api";
import { useState, useEffect } from "react";
import styles from "./NavBar.module.css";
import logo from "../../images/logo.png";

export default function NavBar() {
  const { perfil, getPerfil } = usePerfil();
  const { signed, loading, signout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    if (!loading && signed) {
      getPerfil();
    }
  }, [loading, signed]); 

  const sair = async () => {
    try {
      const res = await apiFetch("/api/auth/signout", {
        method: "POST"
      });
      if (res.ok) {
        signout();
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className={styles.containernav}>
      <div className={styles.logonav}>
        <Link to="/">
          <img src={logo} alt="Tropa Livresca" width="100" />
        </Link>
      </div>

      <button
        className={styles.hamburguer}
        onClick={() => setMenuAberto(!menuAberto)}
      >
        ☰
      </button>

      <nav className={`${styles.navbar} ${menuAberto ? styles.menuAberto : ""}`}>
        <ul className={styles.list}>
          <li className={styles.item}>
            <Link to="/">Sobre Nós</Link>
            <ul className={styles.subtema}>
              <li><Link to="/historia">Quem Somos</Link></li>
              <li><Link to="/">O Que Fazemos</Link></li>
              <li><Link to="/">Depoimentos</Link></li>
            </ul>
          </li>
          <li className={styles.item}><Link to="/">Livros</Link></li>
          <li className={styles.item}><Link to="/">Loja</Link></li>
          <li className={styles.item}><Link to="/autores">Autores</Link></li>
          <li className={styles.item}><Link to="/">Blog</Link></li>
          <li className={styles.item}>
            <Link to="/">Se Autopublique</Link>
            <ul className={styles.subtema}>
              <li><Link to="/">Meus Livros</Link></li>
            </ul>
          </li>
          <li className={styles.item}>
            <Link to="/">Ajuda</Link>
            <ul className={styles.subtema}>
              <li><Link to="/">Perguntas Frequentes</Link></li>
              <li><Link to="/">Contato</Link></li>
            </ul>
          </li>
        </ul>

        {signed ? (
          <div className={styles.navbutton}>
            <div className={styles.usuarioMenu}>
              
              {perfil?.imagem && (
                <img src={perfil.imagem} alt="Imagem de perfil" className={styles.imagemPerfil} />
              )}
              <Link to="/perfil" className={styles.button}>
                {perfil?.nome ? `Perfil (${perfil.nome})` : "Perfil"}
              </Link>
            </div>
            <button onClick={sair} className={styles.button}>
              Logout
            </button>
          </div>
        ) : (
          <div className={styles.navbutton}>
            <Link to="/cadastro" className={styles.button}>
              Cadastro
            </Link>
            <Link to="/login" className={styles.button}>
              Login
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
