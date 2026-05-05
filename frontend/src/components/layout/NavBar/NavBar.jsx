import { Link } from "react-router-dom";

import Container from "../Container/Container";

import styles from "./NavBar.module.css";

import logo from "../../images/logo.png";

export default function NavBar() {
  return ( 
    <nav className={styles.navbar}>
      <Container>
        <Link to="/">
          <img src={logo} alt="Tropa Livresca" width="100" />
        </Link>
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
            <Link to="/">Se Autopublique</Link>
          </li>
          <li className={styles.item}>
            <Link to="/">Resenha</Link>
          </li>
          <li className={styles.item}>
            <Link to="/">Ajuda</Link>
          </li>
          {/*coloquei apenas pra facilitar pra eu ver a tela de cadastro ass:Luis*/}
          <button>
            <Link to="/cadastro">Cadastrar</Link>
            <Link to ="/login">Login</Link>
          </button>
        </ul>
      </Container>
    </nav>
  );
}
