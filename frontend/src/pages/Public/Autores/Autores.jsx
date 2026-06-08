import styles from "./Autores.module.css";
import logo from "../../../components/images/cad.png";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Autores() {
  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Autores</h1>

        <p className={styles.descricao}>
          A editora Tropa Livresca reúne autores independentes de todo o Brasil.
          Descubra escritores que compartilham histórias únicas, cheias de
          emoção e originalidade em suas obras.
        </p>

        <div className={styles.busca}>
          <span className={styles.iconebusca}>
            <FaSearch />
          </span>

          <input type="text" placeholder="Buscar autor" />

          <button className={styles.btnbuscar}>Buscar</button>
        </div>
      </div>

      <div className={styles.autorescontainer}>
        <div className={styles.autorinf}>
          <img src={logo} alt="Tropa Livresca" width="100" />
          <h3>Julia Lopes</h3>
          <Link to="/" className={styles.btndetalhes}>
            Ver Perfil
          </Link>
        </div>

        <div className={styles.autorinf}>
          <img src={logo} alt="Tropa Livresca" width="100" />
          <h3>George Orwell</h3>
          <Link to="/" className={styles.btndetalhes}>
            Ver Perfil
          </Link>
        </div>

        <div className={styles.autorinf}>
          <img src={logo} alt="Tropa Livresca" width="100" />
          <h3>Augusto Cury</h3>
          <Link to="/" className={styles.btndetalhes}>
            Ver Perfil
          </Link>
        </div>

        <div className={styles.autorinf}>
          <img src={logo} alt="Tropa Livresca" width="100" />
          <h3>Eiichiro Oda</h3>
          <Link to="/" className={styles.btndetalhes}>
            Ver Perfil
          </Link>
        </div>

        <div className={styles.autorinf}>
          <img src={logo} alt="Tropa Livresca" width="100" />
          <h3>J. K. Rowling</h3>
          <Link to="/" className={styles.btndetalhes}>
            Ver Perfil
          </Link>
        </div>

        <div className={styles.autorinf}>
          <img src={logo} alt="Tropa Livresca" width="100" />
          <h3>Pedro Seron</h3>
          <Link to="/" className={styles.btndetalhes}>
            Ver Perfil
          </Link>
        </div>

        <div className={styles.autorinf}>
          <img src={logo} alt="Tropa Livresca" width="100" />
          <h3>Pedro Seron</h3>
          <Link to="/" className={styles.btndetalhes}>
            Ver Perfil
          </Link>
        </div>

        <div className={styles.autorinf}>
          <img src={logo} alt="Tropa Livresca" width="100" />
          <h3>Pedro Seron</h3>
          <Link to="/" className={styles.btndetalhes}>
            Ver Perfil
          </Link>
        </div>
      </div>
    </main>
  );
}
