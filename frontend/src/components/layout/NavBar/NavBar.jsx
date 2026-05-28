import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { apiFetch } from "../../../services/api";

import { useState, useEffect } from "react";

import Container from "../Container/Container";

import styles from "./NavBar.module.css";

import logo from "../../images/logo.png";

/**
 * Componente de Barra de Navegação Superior
 * Contém o logotipo e os links principais de navegação do sistema
 *
 * @component
 * @returns {JSX.Element}
 */
export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { signout } = useAuth();

  const sair = async () => {
    try {
      const res = await apiFetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
        }
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
            "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
          }
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



  return (
    <div className={styles.containernav}>
      <div className={styles.logonav}>
        <Link to="/">
          <img src={logo} alt="Tropa Livresca" width="100" />
        </Link>
      </div>
      <nav className={styles.navbar}>
        <ul className={styles.list}>
          <li className={styles.item}>
            <Link to="/">Sobre Nós</Link>
          </li>
          <li className={styles.item}>
            <Link to="/">Livros</Link>
          </li>
          <li className={styles.item}>
            <Link to="/">Loja</Link>
          </li>
          <li className={styles.item}>
            <Link to="/">Autores</Link>
          </li>
          <li className={styles.item}>
            <Link to="/">Blog</Link>
          </li>
          <li className={styles.item}>
            <Link to="/novolivro">Ajuda</Link>
          </li>
          <li className={styles.item}>
            <Link to="/">Se Autopublique</Link>
          </li>
          <li className={styles.item}>
            <Link to="/">Ajuda</Link>
          </li>
        </ul>

        {isLoggedIn ? (
          <div className={styles.navbutton}>
            <Link to="/perfil" className={styles.button}>
              Perfil
            </Link>
            <button onClick = {sair} className={styles.button}>
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
