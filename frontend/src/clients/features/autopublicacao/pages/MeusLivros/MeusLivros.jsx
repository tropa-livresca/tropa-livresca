import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMeusLivros } from "../../hooks/useMeusLivros";
import styles from "./MeusLivros.module.css";
import { IoLibraryOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import Carregando from "../../../../components/Carregando/Carregando";
import { FiChevronDown } from "react-icons/fi";

export default function MeusLivros() {
  const {
    livros,
    carregando,
    meta,
    buscarLivrosById,
    updateEstado,
    inativarLivro,
  } = useMeusLivros();

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [ordem, setOrdem] = useState("");
  const [estado, setEstado] = useState("");
  const [dropdownAberto, setDropdownAberto] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    buscarLivrosById(paginaAtual, 12, busca, filtro, ordem, estado);
  }, [paginaAtual, busca, filtro, ordem, estado, buscarLivrosById]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
  };

  const handleFiltro = (novoFiltro) => {
    setFiltro(novoFiltro);
    setPaginaAtual(1);
    setDropdownAberto(null);
  };

  const handleOrdem = (novaOrdem) => {
    setOrdem(novaOrdem);
    setPaginaAtual(1);
    setDropdownAberto(null);
  };

  const handleEstado = (novoEstado) => {
    setEstado(novoEstado);
    setPaginaAtual(1);
    setDropdownAberto(null);
  };

  const possuiLivros = Array.isArray(livros) && livros.length > 0;

  if (carregando) {
    return <Carregando mensagem="Carregando meus livros..." />;
  }

  return (
    <main>
      <header className={styles.topo}>
        <div className={styles.subcontainer}>
          <div>
            <h1 className={styles.titulo}>Meus Livros</h1>
            <p>Onde suas ideias ganham páginas e ganham vida.</p>
          </div>

          <Link to="/novo-livro" className={styles.btn}>
            + Novo Livro
          </Link>
        </div>
      </header>

      <div className={styles.container}>
        <form onSubmit={handleBuscar} className={styles.busca}>
          <span className={styles.iconebusca}>
            <FaSearch />
          </span>

          <input
            type="text"
            placeholder="Buscar livros meus..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPaginaAtual(1);
            }}
            className={styles.inputBusca}
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
                className={dropdownAberto === "ordem" ? styles.setaAberta : ""}
              />
            </div>

            {dropdownAberto === "ordem" && (
              <div className={styles.options}>
                <div onClick={() => handleOrdem("")}>
                  <span>Ordenar por</span>
                </div>

                <div onClick={() => handleOrdem("ascendente")}>
                  <span>Mais Antigos</span>
                </div>

                <div onClick={() => handleOrdem("descendente")}>
                  <span>Mais Recentes</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.selectContainer}>
            <div
              className={styles.select2}
              onClick={() =>
                setDropdownAberto(dropdownAberto === "estado" ? null : "estado")
              }
            >
              <span>
                {estado === "rascunho"
                  ? "Rascunho"
                  : estado === "em_revisao"
                    ? "Em revisão"
                    : estado === "publicado"
                      ? "Publicado"
                      : "Todos os estados"}
              </span>

              <FiChevronDown
                className={dropdownAberto === "estado" ? styles.setaAberta : ""}
              />
            </div>

            {dropdownAberto === "estado" && (
              <div className={styles.options}>
                <div onClick={() => handleEstado("")}>
                  <span>Todos os estados</span>
                </div>

                <div onClick={() => handleEstado("rascunho")}>
                  <span>Rascunho</span>
                </div>

                <div onClick={() => handleEstado("em_revisao")}>
                  <span>Em revisão</span>
                </div>

                <div onClick={() => handleEstado("publicado")}>
                  <span>Publicado</span>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className={styles.btnbuscar}>
            Buscar
          </button>
        </form>

        {possuiLivros ? (
          <div className={styles.tabelaLinhas}>
            {livros.map((livro) => (
              <div key={livro.id} className={styles.linhaLivro}>
                <div className={styles.infoColuna}>
                  <div className={styles.capaContainer}>
                    {livro.capa?.frente ? (
                      <img
                        src={livro.capa.frente}
                        alt={livro.titulo}
                        className={styles.capaMini}
                      />
                    ) : (
                      <div className={styles.semCapaMini}>
                        <IoLibraryOutline />
                      </div>
                    )}
                  </div>

                  <div className={styles.detalhesTexto}>
                    <strong className={styles.livroTitulo}>
                      {livro.titulo}
                    </strong>

                    <span className={`${styles.badge} ${styles[livro.estado]}`}>
                      {livro.estado}
                    </span>
                  </div>
                </div>

                <div className={styles.acoesColuna}>
                  <Link
                    to={`/visualizar-livro/${livro.id}`}
                    className={`${styles.btnAcao} ${styles.btnVisualizar}`}
                  >
                    Visualizar
                  </Link>

                  {livro.estado === "rascunho" && (
                    <>
                      <Link
                        to={`/editar-livro/${livro.id}`}
                        className={`${styles.btnAcao} ${styles.btnEditar}`}
                      >
                        Editar
                      </Link>

                      <button
                        onClick={() => updateEstado(livro.id, "em_revisao")}
                        className={`${styles.btnAcao} ${styles.btnPublicar}`}
                      >
                        Enviar para Revisão
                      </button>
                    </>
                  )}

                  {livro.estado === "em_revisao" && (
                    <button
                      onClick={() => updateEstado(livro.id, "rascunho")}
                      className={`${styles.btnAcao} ${styles.btnPublicar}`}
                    >
                      Cancelar Revisão
                    </button>
                  )}

                  {livro.estado === "publicado" && (
                    <span className={styles.textoPublicado}>Publicado</span>
                  )}

                  {livro.estado !== "em_revisao" && (
                    <button
                      onClick={() => {
                        if (confirm("Deseja inativar este livro?")) {
                          inativarLivro(livro.id);
                        }
                      }}
                      className={`${styles.btnAcao} ${styles.btnInativar}`}
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            ))}
              <div className={styles.adicionardiv}>
                  <Link to="/novo-livro" className={styles.btnAdicionar}>
        +
      </Link>
      </div>
          </div>
        ) : (
          <div className={styles.cardnenhumlivro}>
            <IoLibraryOutline size={60} />

            <h1 className={styles.titulon}>
              Sua estante está esperando por você.
            </h1>

            <span className={styles.sub}>
              Dê o primeiro passo na sua carreira de escritor. Autopublique seu
              livro e compartilhe sua obra com novos leitores.
            </span>
          </div>
        )}

        {!carregando && meta && meta.totalPages > 1 && (
          <div className={styles.paginacao}>
            <button
              onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaAtual === 1}
              className={styles.btnPaginacao}
            >
              Anterior
            </button>

            <span className={styles.textoPaginacao}>
              Página {paginaAtual} de {meta.totalPages}{" "}
              <small>(Total: {meta.totalItems})</small>
            </span>

            <button
              onClick={() =>
                setPaginaAtual((prev) => Math.min(prev + 1, meta.totalPages))
              }
              disabled={paginaAtual === meta.totalPages}
              className={styles.btnPaginacao}
            >
              Próximo
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
