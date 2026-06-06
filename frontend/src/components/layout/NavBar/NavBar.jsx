import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import usePerfil from "../../../hooks/usePerfil";
import { apiFetch } from "../../../services/api";

import { useState, useEffect } from "react";

import Container from "../Container/Container";

import styles from "./NavBar.module.css";

import logo from "../../images/logo.png";

export default function NavBar() {
  const {
    perfil,
    nome,
    getPerfil,
  } = usePerfil();

  useEffect(() => {
      const carregarDados = async () => {
        await getPerfil();
      };
      carregarDados();
    }, []);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { signout } = useAuth();

  const sair = async () => {
    try {
      const res = await apiFetch("/api/auth/signout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      });
      if (res.ok) {
        setIsLoggedIn(false);
        signout();
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await apiFetch("/api/auth/perfil", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        });
        if (response.ok) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
      }
    };

    checkAuthStatus();
  }, []);

  const [menuAberto, setMenuAberto] = useState(false);

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
        {" "}
        ☰{" "}
      </button>

      <nav
        className={`${styles.navbar} ${menuAberto ? styles.menuAberto : ""}`}
      >
        <ul className={styles.list}>
          <li className={styles.item}>
            <Link to="/">Sobre Nós</Link>
            <ul className={styles.subtema}>
              <li>
                <Link to="/historia">Quem Somos</Link>
              </li>
              <li>
                <Link to="/">O Que Fazemos</Link>
              </li>
              <li>
                <Link to="/">Depoimentos</Link>
              </li>
            </ul>
          </li>
          <li className={styles.item}>
            <Link to="/">Livros</Link>
          </li>
          <li className={styles.item}>
            <Link to="/">Loja</Link>
          </li>
          <li className={styles.item}>
            <Link to="/autores">Autores</Link>
          </li>
          <li className={styles.item}>
            <Link to="/">Blog</Link>
          </li>
          <li className={styles.item}>
            <Link to="/">Se Autopublique</Link>
            <ul className={styles.subtema}>
              <li>
                <Link to="/">Meus Livros</Link>
              </li>
            </ul>
          </li>
          <li className={styles.item}>
            <Link to="/">Ajuda</Link>
            <ul className={styles.subtema}>
              <li>
                <Link to="/">Perguntas Frequentes</Link>
              </li>
              <li>
                <Link to="/">Contato</Link>
              </li>
            </ul>
          </li>
        </ul>

        {isLoggedIn ? (
          <div className={styles.navbutton}>
            <div>
            {perfil.imagem && <img src={perfil.imagem} alt="Imagem de perfil" className = {styles.imagemPerfil}/>}
            <Link to="/perfil" className={styles.button}>
              Perfil
            </Link>
            </div>
            <Link>
              <button onClick={sair} className={styles.button}>
                Logout
              </button>
            </Link>
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
