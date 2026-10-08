import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRevisao } from "../../hooks/useRevisao.js";
import { FaSearch } from "react-icons/fa";
import { FiBookOpen, FiFileText, FiChevronDown } from "react-icons/fi";
import Paginacao from "../../../../../common/components/Paginacao/Paginacao.jsx";
import styles from "./Revisoes.module.css";
import Carregando from "../../../../components/Carregando/Carregando";

export default function Revisoes() {
  const { revisoes, meta, carregando, buscarRevisoes } = useRevisao();

  const [termoBusca, setTermoBusca] = useState("");
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [ordem, setOrdem] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [ordemAberta, setOrdemAberta] = useState(false);

  useEffect(() => {
    buscarRevisoes({
      page: paginaAtual,
      limit: 12,
      busca,
      filtro,
      ordem,
    });
  }, [paginaAtual, busca, filtro, ordem, buscarRevisoes]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setBusca(termoBusca);
    setPaginaAtual(1);
  };

  const selecionarFiltro = (valor) => {
    setFiltro(valor);
    setPaginaAtual(1);
    setFiltroAberto(false);
  };

  const selecionarOrdem = (valor) => {
    setOrdem(valor);
    setPaginaAtual(1);
    setOrdemAberta(false);
  };

  const nomeFiltro = {
    "": "Ordenar por",
    alfabetico: "Ordem Alfabética",
    data: "Data de Publicação",
  };

  const nomeOrdem = {
    "": "Selecionar ordem",
    ascendente: "Crescente / Antigos",
    descendente: "Decrescente / Recentes",
  };

  return (
    <main>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Livros publicados pela editora</h1>

        <p>
          Acompanhe os livros da editora, seus autores e o estado de revisão.
        </p>
      </div>

      <div className={styles.container}>
        <form onSubmit={handleBuscar} className={styles.filtroContainer}>
          <div className={styles.inputGrupo}>
            <span className={styles.iconeBusca}>
              <FaSearch />
            </span>

            <input
              type="text"
              placeholder="Buscar por título do livro..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className={styles.inputBusca}
            />
          </div>

          <div className={styles.selectGrupo}>
            <div className={styles.selectCustom}>
              <button
                type="button"
                className={styles.selectBotao}
                onClick={() => {
                  setFiltroAberto(!filtroAberto);
                  setOrdemAberta(false);
                }}
              >
                <span>{nomeFiltro[filtro]}</span>
                <FiChevronDown
                  className={filtroAberto ? styles.iconeAberto : ""}
                />
              </button>

              {filtroAberto && (
                <div className={styles.opcoes}>
                  <button
                    type="button"
                    className={`${styles.opcao} ${
                      filtro === "" ? styles.opcaoSelecionada : ""
                    }`}
                    onClick={() => selecionarFiltro("")}
                  >
                    Ordenar por
                  </button>

                  <button
                    type="button"
                    className={`${styles.opcao} ${
                      filtro === "alfabetico" ? styles.opcaoSelecionada : ""
                    }`}
                    onClick={() => selecionarFiltro("alfabetico")}
                  >
                    Ordem Alfabética
                  </button>

                  <button
                    type="button"
                    className={`${styles.opcao} ${
                      filtro === "data" ? styles.opcaoSelecionada : ""
                    }`}
                    onClick={() => selecionarFiltro("data")}
                  >
                    Data de Publicação
                  </button>
                </div>
              )}
            </div>

            <div className={styles.selectCustom}>
              <button
                type="button"
                className={styles.selectBotao}
                onClick={() => {
                  setOrdemAberta(!ordemAberta);
                  setFiltroAberto(false);
                }}
              >
                <span>{nomeOrdem[ordem]}</span>
                <FiChevronDown
                  className={ordemAberta ? styles.iconeAberto : ""}
                />
              </button>

              {ordemAberta && (
                <div className={styles.opcoes}>
                  <button
                    type="button"
                    className={`${styles.opcao} ${
                      ordem === "ascendente" ? styles.opcaoSelecionada : ""
                    }`}
                    onClick={() => selecionarOrdem("ascendente")}
                  >
                    Antigos
                  </button>

                  <button
                    type="button"
                    className={`${styles.opcao} ${
                      ordem === "descendente" ? styles.opcaoSelecionada : ""
                    }`}
                    onClick={() => selecionarOrdem("descendente")}
                  >
                    Recentes
                  </button>
                </div>
              )}
            </div>
          </div>

          <button type="submit" className={styles.botaoBuscar}>
            <FaSearch />
            <span>Buscar</span>
          </button>
        </form>

        {carregando ? (
          <Carregando mensagem="Carregando revisões..." />
        ) : !revisoes || revisoes.length === 0 ? (
          <div className={styles.feedback}>
            Nenhum rascunho ou revisão encontrado.
          </div>
        ) : (
          <div className={styles.gridRevisoes}>
            {revisoes.map((revisao) => {
              const livro = revisao.livros;

              return (
                <article key={revisao.id} className={styles.cardRevisao}>
                  <div className={styles.cardHeader}>
                    <div className={styles.capaContainer}>
                      {livro?.capa?.frente ? (
                        <img
                          src={livro.capa.frente}
                          alt={`Capa do livro ${livro?.titulo}`}
                          className={styles.capaLivro}
                        />
                      ) : (
                        <div className={styles.semCapa}>
                          <span>Sem Capa</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.infoLivro}>
                      <span className={styles.livroId}>
                        ID #{livro?.id || "---"}
                      </span>

                      <h3 className={styles.livroTitulo}>
                        {livro?.titulo || "Sem título"}
                      </h3>

                      {livro?.subtitulo && (
                        <p className={styles.livroSubtitulo}>
                          {livro.subtitulo}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.infoRevisao}>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Revisor</span>

                        <strong className={styles.infoValor}>
                          <span className={styles.numeroo}>{revisao.nome || "---"}</span>
                        </strong>
                      </div>

                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>
                          Data da revisão
                        </span>

                        <strong className={styles.infoValor}>
                          <span className={styles.numeroo}>{revisao.data || "---"}</span>
                        </strong>
                      </div>

                      <div
                        className={`${styles.infoItem} ${styles.infoApontamento}`}
                      >
                        <span className={styles.infoLabel}>Apontamento</span>

                        <strong className={styles.infoValor}>
                          <span className={styles.numeroo}>{revisao.apontamento || "---"}</span>
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardAcoes}>
                    <Link
                      to={`/admin/livros/revisoes/visualizar/${revisao.id}`}
                      className={styles.linkPrimario}
                    >
                      <FiFileText />
                      <span>Ver Revisão</span>
                    </Link>

                    {livro?.id && (
                      <Link
                        to={`/admin/livros/visualizar/${livro.id}`}
                        className={styles.linkSecundario}
                      >
                        <FiBookOpen />
                        <span>Ver Livro</span>
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!carregando && meta?.totalPages > 1 && (
          <div className={styles.paginacaoContainer}>
            <Paginacao
              paginaAtual={paginaAtual}
              totalPaginas={meta.totalPages}
              totalItems={meta.totalItems}
              onMudarPagina={setPaginaAtual}
            />
          </div>
        )}
      </div>
    </main>
  );
}
