import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMeusLivros } from "../../hooks/useMeusLivros";
import styles from "./MeusLivros.module.css";
import { IoLibraryOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import Paginacao from "../../../../../common/components/Paginacao/Paginacao";
import Carregando from "../../../../components/Carregando/Carregando";
import { FiChevronDown } from "react-icons/fi";
import {
  ESTADOS_EDITAVEIS,
  ESTADOS_ENVIAVEIS_REVISAO,
  LIVRO_ESTADO,
} from "../../../../../common/config/livroEstados";

const ORDENACOES = [
  { chave: "az", rotulo: "Título (A–Z)", filtro: "", ordem: "" },
  { chave: "za", rotulo: "Título (Z–A)", filtro: "alfabetico", ordem: "descendente" },
  { chave: "recentes", rotulo: "Mais recentes", filtro: "data", ordem: "descendente" },
  { chave: "antigos", rotulo: "Mais antigos", filtro: "data", ordem: "ascendente" },
];

const FILTROS_ESTADO = [
  ["", "Todos"],
  [LIVRO_ESTADO.RASCUNHO, "Rascunhos"],
  [LIVRO_ESTADO.EM_REVISAO, "Em revisão"],
  [LIVRO_ESTADO.PUBLICADO, "Publicados"],
  [LIVRO_ESTADO.NEGADO, "Negados"],
];

export default function MeusLivros() {
  const {
    livros,
    carregando,
    meta,
    buscarLivros,
    atualizarEstado,
    deletarLivro,
  } = useMeusLivros();

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [ordem, setOrdem] = useState("");
  const [estado, setEstado] = useState("");
  const [dropdownAberto, setDropdownAberto] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    buscarLivros(paginaAtual, 12, busca, filtro, ordem, estado);
  }, [paginaAtual, busca, filtro, ordem, estado, buscarLivros]);

  const recarregarLivros = () =>
    buscarLivros(paginaAtual, 12, busca, filtro, ordem, estado);

  const enviarParaRevisao = async (id) => {
    await atualizarEstado(id, LIVRO_ESTADO.EM_REVISAO);
    await recarregarLivros();
  };

  const excluirLivro = async (id) => {
    await deletarLivro(id);
    await recarregarLivros();
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
  };

  const handleOrdenacao = (opcao) => {
    setFiltro(opcao.filtro);
    setOrdem(opcao.ordem);
    setPaginaAtual(1);
    setDropdownAberto(null);
  };

  const ordenacaoAtual =
    ORDENACOES.find((o) => o.filtro === filtro && o.ordem === ordem) ||
    ORDENACOES[0];

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
        <form onSubmit={handleBuscar} className={styles.painelBusca}>
          <div className={styles.linhaBusca}>
            <label className={styles.campoBusca}>
              <FaSearch className={styles.iconeLupa} aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar pelo título..."
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPaginaAtual(1);
                }}
                aria-label="Buscar pelo título"
              />
            </label>

            <div className={styles.ordenar}>
              <button
                type="button"
                className={styles.botaoOrdenar}
                onClick={() => setDropdownAberto(!dropdownAberto)}
                aria-expanded={!!dropdownAberto}
              >
                <span className={styles.rotuloOrdenar}>Ordenar:</span>{" "}
                {ordenacaoAtual.rotulo}
                <FiChevronDown
                  className={dropdownAberto ? styles.setaAberta : ""}
                />
              </button>

              {dropdownAberto && (
                <ul className={styles.opcoesOrdenar}>
                  {ORDENACOES.map((opcao) => (
                    <li key={opcao.chave}>
                      <button
                        type="button"
                        className={
                          opcao.chave === ordenacaoAtual.chave
                            ? styles.opcaoAtiva
                            : ""
                        }
                        onClick={() => handleOrdenacao(opcao)}
                      >
                        {opcao.rotulo}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={styles.estados} role="group" aria-label="Filtrar por estado">
            {FILTROS_ESTADO.map(([valor, rotulo]) => (
              <button
                key={rotulo}
                type="button"
                className={`${styles.pilula} ${estado === valor ? styles.pilulaAtiva : ""}`}
                aria-pressed={estado === valor}
                onClick={() => {
                  setEstado(valor);
                  setPaginaAtual(1);
                }}
              >
                {rotulo}
              </button>
            ))}
          </div>
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

                  {ESTADOS_EDITAVEIS.includes(livro.estado) && (
                    <>
                      <Link
                        to={`/editar-livro/${livro.id}`}
                        className={`${styles.btnAcao} ${styles.btnEditar}`}
                      >
                        Editar
                      </Link>

                      {ESTADOS_ENVIAVEIS_REVISAO.includes(livro.estado) && (
                        <button
                          type="button"
                          onClick={() => enviarParaRevisao(livro.id)}
                          className={`${styles.btnAcao} ${styles.btnPublicar}`}
                        >
                          Enviar para Revisão
                        </button>
                      )}
                    </>
                  )}

                  {livro.estado === LIVRO_ESTADO.PUBLICADO && (
                    <span className={styles.textoPublicado}>Publicado</span>
                  )}

                  {livro.estado === LIVRO_ESTADO.RASCUNHO && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Deseja excluir este livro?")) {
                          excluirLivro(livro.id);
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

        {meta && meta.totalPages > 1 && (
          <Paginacao
            paginaAtual={paginaAtual}
            totalPaginas={meta?.totalPages}
            totalItems={meta?.totalItems}
            onMudarPagina={setPaginaAtual}
          />
        )}
      </div>
    </main>
  );
}
