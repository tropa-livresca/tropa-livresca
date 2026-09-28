import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRevisao } from "../../hooks/useRevisao.js";
import { FaSearch } from "react-icons/fa";
import Paginacao from "../../../../../common/components/Paginacao/Paginacao.jsx";
import styles from "./Revisoes.module.css"; // Importando o CSS

export default function Revisoes() {
  const { revisoes, meta, carregando, buscarRevisoes } = useRevisao();

  const [termoBusca, setTermoBusca] = useState("");
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [ordem, setOrdem] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    buscarRevisoes(paginaAtual, 12, busca, filtro, ordem);
  }, [paginaAtual, busca, filtro, ordem, buscarRevisoes]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setBusca(termoBusca);
    setPaginaAtual(1);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.titulo}>Revisões de Livros</h1>

      {/* Barra de Filtros e Busca */}
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
          <select
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value);
              setPaginaAtual(1);
            }}
            className={styles.selectFiltro}
          >
            <option value="">Ordenar por</option>
            <option value="alfabetico">Ordem Alfabética</option>
            <option value="data">Data de Publicação</option>
          </select>

          <select
            value={ordem}
            onChange={(e) => {
              setOrdem(e.target.value);
              setPaginaAtual(1);
            }}
            className={styles.selectFiltro}
          >
            <option value="ascendente">Crescente / Antigos</option>
            <option value="descendente">Decrescente / Recentes</option>
          </select>
        </div>

        <button type="submit" className={styles.botaoBuscar}>
          Buscar
        </button>
      </form>

      {/* Área de Conteúdo / Grid */}
      {carregando ? (
        <div className={styles.feedback}>Carregando revisões...</div>
      ) : !revisoes || revisoes.length === 0 ? (
        <div className={styles.feedback}>
          Nenhum rascunho ou revisão encontrado.
        </div>
      ) : (
        <div className={styles.gridRevisoes}>
          {revisoes.map((revisao) => {
            const livro = revisao.livros;
            return (
              <div key={revisao.id} className={styles.cardRevisao}>
                <div className={styles.cardHeader}>
                  <div className={styles.capaContainer}>
                    {livro?.capa?.frente ? (
                      <img
                        src={livro.capa.frente}
                        alt={`Capa do livro ${livro?.titulo}`}
                        className={styles.capaLivro}
                      />
                    ) : (
                      <div className={styles.semCapa}>Sem Capa</div>
                    )}
                  </div>
                  <div className={styles.infoLivro}>
                    <span className={styles.livroId}>
                      ID: #{livro?.id || "---"}
                    </span>
                    <h3 className={styles.livroTitulo}>
                      {livro?.titulo || "Sem título"}
                    </h3>
                    {livro?.subtitulo && (
                      <p className={styles.livroSubtitulo}>{livro.subtitulo}</p>
                    )}
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <p>
                    <strong>Revisor:</strong> {revisao.nome}
                  </p>
                  <p className={styles.apontamento}>
                    <strong>Apontamento:</strong> {revisao.apontamento}
                  </p>
                  <span className={styles.dataRevisao}>{revisao.data}</span>
                </div>

                <div className={styles.cardAcoes}>
                  <Link
                    to={`/admin/livros/revisoes/visualizar/${revisao.id}`}
                    className={styles.linkPrimario}
                  >
                    Ver Revisão
                  </Link>
                  {livro?.id && (
                    <Link
                      to={`/admin/livros/visualizar/${livro.id}`}
                      className={styles.linkSecundario}
                    >
                      Ver Livro
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginação */}
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
    </main>
  );
}
