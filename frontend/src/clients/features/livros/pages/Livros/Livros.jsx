import { useLivros } from "../../../../hooks/useLivros";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Carregando from "../../../../components/Carregando/Carregando";
import styles from "./Livros.module.css";
import { FiChevronDown } from "react-icons/fi";

export default function Livros() {
  const { Livros, BuscarLivros, carregando, meta } = useLivros();

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [ordem, setOrdem] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dropdownAberto, setDropdownAberto] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      await BuscarLivros(paginaAtual, 12, busca, filtro, ordem);
    };

    carregarDados();
  }, [paginaAtual, filtro, ordem, busca, BuscarLivros]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    BuscarLivros(1, 12, busca, filtro, ordem);
  };

  return (
    <main>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Livros publicados pela editora</h1>

        <p>
          Histórias que transformam, ideias que inspiram: explore nosso
          catálogo.
        </p>
      </div>

      <div className={styles.container}>
        <form onSubmit={handleBuscar} className={styles.busca}>
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
                setDropdownAberto(dropdownAberto === "filtro" ? null : "filtro")
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
                className={dropdownAberto === "filtro" ? styles.setaAberta : ""}
              />
            </div>

            {dropdownAberto === "filtro" && (
              <div className={styles.options}>
                <div
                  onClick={() => {
                    setFiltro("");
                    setPaginaAtual(1);
                    setDropdownAberto(null);
                  }}
                >
                  <span>Ordenar por</span>
                </div>

                <div
                  onClick={() => {
                    setFiltro("alfabetico");
                    setPaginaAtual(1);
                    setDropdownAberto(null);
                  }}
                >
                  <span>Ordem Alfabética</span>
                </div>

                <div
                  onClick={() => {
                    setFiltro("data");
                    setPaginaAtual(1);
                    setDropdownAberto(null);
                  }}
                >
                  <span>Data de Publicação</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.selectContainer}>
            <div
              className={styles.select1}
              onClick={() =>
                setDropdownAberto(dropdownAberto === "ordem" ? null : "ordem")
              }
            >
              <span>
                {ordem === "ascendente"
                  ? "Mais Antigos"
                  : ordem === "descendente"
                    ? "Mais Recentes"
                    : "Ordenar por"}
              </span>

              <FiChevronDown
                className={dropdownAberto === "filtro" ? styles.setaAberta : ""}
              />
            </div>

            {dropdownAberto === "ordem" && (
              <div className={styles.options}>
                <div
                  onClick={() => {
                    setOrdem("");
                    setPaginaAtual(1);
                    setDropdownAberto(null);
                  }}
                >
                  <span>Ordenar por</span>
                </div>

                <div
                  onClick={() => {
                    setOrdem("ascendente");
                    setPaginaAtual(1);
                    setDropdownAberto(null);
                  }}
                >
                  <span>Mais Antigos</span>
                </div>

                <div
                  onClick={() => {
                    setOrdem("descendente");
                    setPaginaAtual(1);
                    setDropdownAberto(null);
                  }}
                >
                  <span>Mais Recentes</span>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className={styles.btnbuscar}>
            Buscar
          </button>
        </form>

        {carregando ? (
          <div className={styles.carregando}>
            <Carregando mensagem="Carregando livros..." />
          </div>
        ) : !Livros || Livros.length === 0 ? (
          <p className={styles.semLivros}>Nenhum livro encontrado</p>
        ) : (
          <div className={styles.livros}>
            {Livros.map((livro) => {
              return (
                <div key={livro.id} className={styles.cardLivro}>
                  <Link
                    to={`/livros/detalhes/${livro.id}`}
                    className={styles.linkCapa}
                  >
                    <div className={styles.capaContainer}>
                      {livro?.capa?.frente ? (
                        <img
                          src={livro.capa.frente}
                          alt={livro.titulo}
                          className={styles.capa}
                        />
                      ) : (
                        <div className={styles.semImagem}>Sem imagem</div>
                      )}
                    </div>
                  </Link>

                  <div className={styles.infoLivro}>
                    <Link
                      to={`/livros/detalhes/${livro.id}`}
                      className={styles.linkLivro}
                    >
                      <h3>{livro.titulo || "Sem título"}</h3>

                      <p className={styles.autor}>
                        {livro.autor_nome || "Sem autor"}{" "}
                        {livro.autor_sobrenome || ""}
                      </p>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!carregando && meta && meta.totalPages > 1 && (
          <div className={styles.paginacao}>
            <button
              onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaAtual === 1}
            >
              Anterior
            </button>

            <span>
              Página {paginaAtual} de {meta.totalPages}
            </span>

            <button
              onClick={() =>
                setPaginaAtual((prev) => Math.min(prev + 1, meta.totalPages))
              }
            >
              Próximo
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
