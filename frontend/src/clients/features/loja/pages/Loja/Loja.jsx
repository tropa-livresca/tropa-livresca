import styles from "./Loja.module.css";
import Carregando from "../../../../components/Carregando/Carregando";
import { useLivrosLoja } from "../../hooks/useLivrosLoja";
import Paginacao from "../../../../../common/components/Paginacao/Paginacao";
import { FaSearch } from "react-icons/fa";
import { FiChevronDown, FiShoppingCart } from "react-icons/fi";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Loja() {
  const { livros, meta, carregando, buscarLivros } = useLivrosLoja();

  const [dropdownAberto, setDropdownAberto] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [ordem, setOrdem] = useState("");
  const [busca, setBusca] = useState("");
  const [buscaEnviada, setBuscaEnviada] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    buscarLivros(paginaAtual, 12, buscaEnviada, filtro, ordem);
  }, [buscarLivros, paginaAtual, filtro, buscaEnviada, ordem]);

  const handleFiltro = (novoFiltro) => {
    setFiltro(novoFiltro);
    setOrdem("");
    setPaginaAtual(1);
    setDropdownAberto(null);
  };

  const handleBusca = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    setBuscaEnviada(busca.trim());
  };

  const handleOrdem = (novaOrdem) => {
    setOrdem(novaOrdem);
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
            <form onSubmit={handleBusca} className={styles.busca}>
              <span className={styles.iconebusca}>
                <FaSearch />
              </span>

              <input
                className={styles.inputBusca}
                type="text"
                placeholder="Buscar livro"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
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
                    <div
                      onClick={() => {
                        handleFiltro("");
                        setOrdem("");
                      }}
                    >
                      <span>Ordenar por</span>
                    </div>

                    <div onClick={() => handleFiltro("alfabetico")}>
                      <span>Ordem Alfabética</span>
                    </div>

                    <div onClick={() => handleFiltro("data")}>
                      <span>Data de Publicação</span>
                    </div>

                    {filtro && (
                      <>
                        <div onClick={() => handleOrdem("ascendente")}>
                          <span>Ascendente</span>
                        </div>

                        <div onClick={() => handleOrdem("descendente")}>
                          <span>Descendente</span>
                        </div>
                      </>
                    )}
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
            {carregando ? (
              <Carregando mensagem="Carregando loja ..." />
            ) : livros.length === 0 ? (
              <p>Nenhum livro encontrado.</p>
            ) : (
              livros.map((livro) => (
                <Link
                  key={livro.id}
                  to={`/loja/livro/${livro.id}`}
                  className={styles.card}
                >
                  {livro?.capa?.frente ? (
                    <img
                      src={livro.capa.frente}
                      alt={`Capa de ${livro.titulo}`}
                    />
                  ) : (
                    <div className={styles.semImagem}>Sem imagem</div>
                  )}

                  <div>
                    <span
                      className={
                        livro.origem === "tropa" ? styles.tropa : styles.externo
                      }
                    >
                      {livro.origem === "tropa"
                        ? "Publicado na Tropa"
                        : "Catálogo externo"}
                    </span>

                    <h2>{livro.titulo}</h2>

                    <p>{livro.autor}</p>

                    {livro.vendaInterna && (
                      <div className={styles.precos}>
                        {livro.precoDigital != null && (
                          <span>
                            Digital:{" "}
                            <strong>
                              R$ {Number(livro.precoDigital).toFixed(2)}
                            </strong>
                          </span>
                        )}

                        {livro.precoFisico != null && (
                          <span>
                            Físico:{" "}
                            <strong>
                              R$ {Number(livro.precoFisico).toFixed(2)}
                            </strong>
                          </span>
                        )}
                      </div>
                    )}

                    {livro.vendaSimulada && (
                      <small className={styles.precoFicticio}>
                        Preços demonstrativos
                      </small>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>

          {!carregando && meta && meta.totalPages > 1 && (
            <Paginacao
              paginaAtual={paginaAtual}
              totalPaginas={meta.totalPages}
              totalItems={meta.totalItems}
              onMudarPagina={(novaPagina) => setPaginaAtual(novaPagina)}
            />
          )}
        </div>
      </div>
    </main>
  );
}
