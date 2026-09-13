import styles from "./Loja.module.css";
import { FaSearch } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Loja() {
  const [dropdownAberto, setDropdownAberto] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const handleFiltro = (novoFiltro) => {
    setFiltro(novoFiltro);
    setPaginaAtual(1);
    setDropdownAberto(null);
  };

  return (
    <main>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Loja</h1>
        <p>
          Nosso site é feito por quem respira livros, pensando na melhor
          experiência para você.
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.containerlivros}>
          <div className={styles.filtros}>
            <div className={styles.oi}>
              <h1>Gênero</h1>
            </div>
            <ul>
              <li>Romance</li>
              <li>Fantasia</li>
              <li>Ficção Científica</li>
              <li>Mistério</li>
              <li>Terror</li>
              <li>Aventura</li>
              <li>Drama</li>
              <li>Suspense</li>
              <li>História</li>
            </ul>
          </div>
          <div>
            <form onSubmit className={styles.busca}>
              <span className={styles.iconebusca}>
                <FaSearch />
              </span>

              <input
                className={styles.inputBusca}
                type="text"
                placeholder="Buscar livro"
              />

              <div className={styles.selectContainer}>
                <div
                  className={styles.select}
                  onClick={() =>
                    setDropdownAberto(
                      dropdownAberto === "filtro" ? null : "filtro",
                    )
                  }
                >
                  <span>
                    {filtro === "alfabetico"
                      ? "Ordem Alfabética"
                      : filtro === "data"
                        ? "Data de Publicação"
                        : "Ordenar por"}
                  </span>

                  <FiChevronDown
                    className={
                      dropdownAberto === "filtro" ? styles.setaAberta : ""
                    }
                  />
                </div>

                {dropdownAberto === "filtro" && (
                  <div className={styles.options}>
                    <div onClick={() => handleFiltro("")}>
                      <span>Ordenar por</span>
                    </div>

                    <div onClick={() => handleFiltro("alfabetico")}>
                      <span>Ordem Alfabética</span>
                    </div>

                    <div onClick={() => handleFiltro("data")}>
                      <span>Data de Publicação</span>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className={styles.btnbuscar}>
                Buscar
              </button>
            </form>
          </div>
          <div className={styles.carrinho}>
            <Link to="/carrinho">
              <FiShoppingCart />
            </Link>
          </div>

          <div className={styles.cards}>
            <div className={styles.card}>
              <h2>Livro 1</h2>
              <p>Autor do livro</p>
            </div>

            <div className={styles.card}>
              <h2>Livro 2</h2>
              <p>Autor do livro</p>
            </div>

            <div className={styles.card}>
              <h2>Livro 3</h2>
              <p>Autor do livro</p>
            </div>

            <div className={styles.card}>
              <h2>Livro 4</h2>
              <p>Autor do livro</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
