import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { usePerfil } from "../../features/perfil/hooks/usePerfil";
import { useState, useEffect, useRef } from "react";
import { perfilEvent } from "../../events/perfilEvent";
import styles from "./NavBar.module.css";
import logo from "../../../common/images/logo.png";

import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

export default function NavBar() {
  const { perfil, getPerfil } = usePerfil();
  const { signed, loading, signout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);

  useEffect(() => {
    if (!loading && signed) {
      getPerfil();
    }
  }, [loading, signed]);

  useEffect(() => {
    if (!signed) return;

    const removerInscricao = perfilEvent.inscrever(() => {
      getPerfil();
    });

    return () => removerInscricao();
  }, [signed]);

  const sair = async () => {
    try {
      const errorMsg = await signout();
      if (errorMsg) {
        console.error("Erro ao fazer logout:", errorMsg);
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
              <li><Link to="historia">Quem Somos</Link></li>
              <li><Link to="">O Que Fazemos</Link></li>
              <li><Link to="">Depoimentos</Link></li>
            </ul>
          </li>
          <li className={styles.item}><Link to="livros">Livros</Link></li>
          <li className={styles.item}><Link to="">Loja</Link></li>
          <li className={styles.item}><Link to="autores">Autores</Link></li>
          <li className={styles.item}><Link to="">Blog</Link></li>
          <li className={styles.item}>
            <Link to="">Se Autopublique</Link>
            <ul className={styles.subtema}>
              <li><Link to="meuslivros">Meus Livros</Link></li>
            </ul>
          </li>
          <li className={styles.item}>
            <Link to="/">Suporte</Link>
            <ul className={styles.subtema}>
              <li><Link to="FAQ">Perguntas Frequentes</Link></li>
              <li><Link to="suporte">Contato</Link></li>
            </ul>
          </li>
        </ul>

        {signed ? (
          <div className={styles.navbutton}>
            <div className={styles.usuarioMenu}>
              <button
                className={styles.usuarioBotao}
                onClick={() => setMenuUsuario(!menuUsuario)}
              >
                {perfil?.imagem ? (
                  <img
                    src={perfil.imagem}
                    alt="Imagem de perfil"
                    className={styles.imagemPerfil}
                  />
                ) : (
                  <FaUserCircle className={styles.avatar} />
                )}
              </button>

              <span className={styles.nomeUsuario}>
                {perfil?.nome || "Perfil"}
              </span>

              {menuUsuario && (
                <div className={styles.menuDropdown}>
                  <Link
                    to="perfil"
                    className={styles.menuItem}
                    onClick={() => setMenuUsuario(false)}
                  >
                    <FaUserCircle className={styles.menuIcon} />
                    Meu Perfil
                  </Link>

                  <button
                    className={styles.menuItem}
                    onClick={() => {
                      setMenuUsuario(false);
                      sair();
                    }}
                  >
                    <FiLogOut className={styles.menuIcon} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.navbutton}>
            <Link to="cadastro" className={styles.button}>Cadastro</Link>
            <Link to="login" className={styles.button}>Login</Link>
          </div>
        )}
      </nav>
    </div>
  );
}
