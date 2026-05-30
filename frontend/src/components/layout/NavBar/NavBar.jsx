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
            <Link to="/">Sobre Nós</Link>
            <ul className={styles.subtema}>
              <li><Link to="/historia">Quem Somos</Link></li>
              <li><Link to="/">O Que Fazemos</Link></li>
              <li><Link to="/">Depoimentos</Link></li>
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
        <div className={styles.navbutton}>
        <Link to="/cadastro" className={styles.button}>Cadastro</Link>
        <Link to="/login" className={styles.button}>Login</Link>
      </div>
    </nav>
    </div>
  );
}
