import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMeusLivros } from "../../hooks/useMeusLivros";
import styles from "./MeusLivros.module.css";
import { IoLibraryOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";

export default function MeusLivros() {
  const { livros, carregando, meta, buscarLivrosById, updateEstado, inativarLivro } = useMeusLivros();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [ordem, setOrdem] = useState("");
  const [estado, setEstado] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    buscarLivrosById(paginaAtual, 12, busca, filtro, ordem, estado);
  }, [paginaAtual, busca, filtro, ordem, estado, buscarLivrosById]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
  };

  const possuiLivros = Array.isArray(livros) && livros.length > 0;

  if (carregando) return <div className={styles.loading}>Carregando seus livros...</div>;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.tituloHeader}>Meus Livros</h1>
        <Link to="/novo-livro" className={styles.btn}> Novo Livro </Link>

      </header>

      <form onSubmit={handleBuscar} className={styles.filtroForm}>
        <div className={styles.buscaWrapper}>
          <FaSearch className={styles.buscaIcon} />
          <input
            type="text"
            placeholder="Buscar livros meus..."
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPaginaAtual(1); }}
            className={styles.inputBusca}
          />
        </div>
        <div className={styles.selectsGrid}>
          <select value={filtro} onChange={(e) => { setFiltro(e.target.value); setPaginaAtual(1); }}>
            <option value="">Ordenar por</option>
            <option value="alfabetico">Ordem alfabética</option>
            <option value="data">Data de publicação</option>
          </select>
          <select value={ordem} onChange={(e) => { setOrdem(e.target.value); setPaginaAtual(1); }}>
            <option value="ascendente">Crescente / Antigos</option>
            <option value="descendente">Decrescente / Recentes</option>
          </select>
          <select value={estado} onChange={(e) => { setEstado(e.target.value); setPaginaAtual(1); }}>
            <option value="">Todos os estados</option>
            <option value="rascunho">Rascunho</option>
            <option value="em_revisao">Em revisão</option>
            <option value="publicado">Publicado</option>
          </select>
        </div>
      </form>

      {possuiLivros ? (
        <div className={styles.tabelaLinhas}>
          {livros.map((livro) => (
            <div key={livro.id} className={styles.linhaLivro}>
              <div className={styles.infoColuna}>
                <div className={styles.capaContainer}>
                  {livro.capa?.frente ? (
                    <img src={livro.capa.frente} alt={livro.titulo} className={styles.capaMini} />
                  ) : (
                    <div className={styles.semCapaMini}><IoLibraryOutline /></div>
                  )}
                </div>

                <div className={styles.detalhesTexto}>
                  <strong className={styles.livroTitulo}>{livro.titulo}</strong>
                  <span className={`${styles.badge} ${styles[livro.estado]}`}>{livro.estado}</span>
                </div>
              </div>

              <div className={styles.acoesColuna}>
                <Link to={`/visualizar-livro/${livro.id}`} className={`${styles.btnAcao} ${styles.btnVisualizar}`}>
                  Visualizar
                </Link>

                {livro.estado === "rascunho" && (
                  <>
                    <Link to={`/editar-livro/${livro.id}`} className={`${styles.btnAcao} ${styles.btnEditar}`}>
                      Editar
                    </Link>
                    <button onClick={() => updateEstado(livro.id, "em_revisao")} className={`${styles.btnAcao} ${styles.btnPublicar}`}>
                      Enviar para Revisão
                    </button>
                  </>
                )}

                {livro.estado === "em_revisao" && (
                  <button onClick={() => updateEstado(livro.id, "rascunho")} className={`${styles.btnAcao} ${styles.btnPublicar}`}>
                    Cancelar Revisão
                  </button>
                )}

                {livro.estado === "publicado" && <span className={styles.textoPublicado}>Publicado</span>}

                {livro.estado !== "em_revisao" && (
                  <button
                    onClick={() => { if (confirm("Deseja inativar este livro?")) inativarLivro(livro.id); }}
                    className={`${styles.btnAcao} ${styles.btnInativar}`}
                  >
                    Inativar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.cardnenhumlivro}>
          <IoLibraryOutline size={60} />
          <h1 className={styles.titulon}>Sua estante está esperando por você.</h1>
          <span className={styles.sub}>
            Dê o primeiro passo na sua carreira de escritor. Autopublique seu livro e compartilhe sua obra com novos leitores.
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
          <span className={styles.textoPaginacao}>Página {paginaAtual} de {meta.totalPages} <small>(Total: {meta.totalItems})</small></span>
          <button
            onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, meta.totalPages))}
            disabled={paginaAtual === meta.totalPages}
            className={styles.btnPaginacao}
          >
            Próximo
          </button>
        </div>
      )}
    </main>
  );
}
