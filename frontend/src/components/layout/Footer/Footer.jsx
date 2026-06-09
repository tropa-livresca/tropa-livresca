import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import logo from "../../images/logo.png";

export default function Footer() {
  return (
    <footer className={styles.containerfooter}>
      <div className={styles.footertopo}>
        <div className={styles.footerlogo}>
          <img src={logo} alt="Tropa Livresca" />

          <div className={styles.livromsg}>
            <span></span>
            <i>📖</i>
            <span></span>
          </div>

          <p>" Livros que atravessam épocas, ideias que transformam. "</p>
        </div>

        <div className={styles.footercolunas}>
          <h3>MAPA DO SITE</h3>

          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/">Sobre Nós</Link>
            </li>
            <li>
              <Link to="/">Livros</Link>
            </li>
            <li>
              <Link to="/">Loja</Link>
            </li>
            <li>
              <Link to="/">Autores</Link>
            </li>
            <li>
              <Link to="/">Blog</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footercolunas}>
          <h3 id={styles.h3id}>ATENDIMENTO</h3>

          <p>
            Telefone: <span id={styles.atendimentofont}>(14) 9967-6767</span>
          </p>
          <p>Segunda a sexta, das <span id={styles.atendimentofont}>9</span>h às <span id={styles.atendimentofont}>18</span>h</p>

          <p>
            Rua Dr. David Gabriel <span id={styles.atendimentofont}>667</span>
          </p>
            
          <p>
            Taquarituba-SP
          </p>


        </div>

        <div className={styles.footercolunas}>
          <h3>SIGA-NOS</h3>

          <div className={styles.logoicons}>
            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaLinkedinIn />
            </a>

            <a href="#">
              <FaYoutube />
            </a>
          </div>

          <p id={styles.ptexto}>
              " Acreditamos no poder das palavras para inspirar, conectar e
              transformar. "
          </p>
        </div>
      </div>

      <div className={styles.footerbottom}>
        <p>© 2026 Editora Tropa Livresca</p>

        <div className={styles.footerlinks}>
          <Link to="/">Politica de Privacidade</Link>
          <Link to="/">Termos de Uso</Link>
        </div>
      </div>
    </footer>
  );
}
