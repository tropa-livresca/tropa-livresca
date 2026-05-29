import { Link } from "react-router-dom";

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
            <Link to="/historia">Sobre Nós</Link>   
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
        <div className={styles.navbutton}>
        <Link to="/cadastro" className={styles.button}>Cadastro</Link>
        <Link to="/login" className={styles.button}>Login</Link>
      </div>
    </nav>
    </div>
  );
}
