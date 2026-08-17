import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMeusLivros } from "../../hooks/useMeusLivros";
import styles from "./MeusLivros.module.css";
import { IoLibraryOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";

export default function MeusLivros() {
  const { Livros, carregando, meta, BuscarLivrosById, UpdateEstado, InativarLivro } = useMeusLivros();

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [ordem, setOrdem] = useState("");
  const [estado, setEstado] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    const carregarDados = async () => {
      await BuscarLivrosById(paginaAtual, 12, busca, filtro, ordem, estado);
    }
    carregarDados();
  }, [paginaAtual, filtro, ordem, busca, BuscarLivrosById, estado]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    BuscarLivrosById(1, 12, busca, filtro, ordem, estado);
  }

  const possuiLivros = Array.isArray(Livros) && Livros.length > 0;

  if (carregando) return <div>Carregando seus livros...</div>;

  return (
    <main className={styles.container}>

      <form onSubmit={handleBuscar}>
        <span>
          <FaSearch />
        </span>

        <input
          type="text"
          placeholder="Buscar livros meus"
          value={busca}
          onChange={(e) => { setBusca(e.target.value) }} />

        <select value={filtro} onChange={(e) => { setFiltro(e.target.value); setPaginaAtual(1); }}>
          <option value="">Ordenar por</option>
          <option value="alfabetico">Ordem alfabética</option>
          <option value="data">Data de publicação</option>
        </select>

        <select value={ordem} onChange={(e) => { setOrdem(e.target.value); setPaginaAtual(1); }}>
          <option value="ascendente">Crescente/Antigos</option>
          <option value="descendente">Descrescente / Recentes</option>
        </select>

        <select value={estado} onChange={(e) => { setEstado(e.target.value); setPaginaAtual(1); }}>
          <option value="">Todos</option>
          <option value="rascunho">Rascunho</option>
          <option value="em_revisao">Em revisão</option>
          <option value="publicado">Publicado</option>
        </select>
      </form>

      {possuiLivros ? (
        <div>
          {Livros.map((livro) => (
            <div
              key={livro.id}
            >
              <div>
                {livro.capa?.frente && (
                  <img
                    src={livro.capa.frente}
                    alt={livro.titulo}
                    style={{ width: "50px" }}
                  />
                )}
                <br />
                <strong>{livro.titulo}</strong> — <span>{livro.estado}</span>
              </div>

              <div>
                <button className={`${styles.btn} ${styles.btnVisualizar}`}>
                  <Link to = {`/visualizar-livro/${livro.id}`}>
                    Visualizar
                  </Link>
                </button>

                <Link
                  to={`/editar-livro/${livro.id}`}
                  className={`${styles.btn} ${styles.btnEditar}`}
                >
                  Editar
                </Link>

                {livro.estado === "rascunho" && (
                  <button
                    onClick={() => UpdateEstado(livro.id, "em_revisao")}
                    className={`${styles.btn} ${styles.btnPublicar}`}
                  >
                    Enviar para Revisão
                  </button>
                )}

                {livro.estado === "em_revisao" && (
                  <button
                    onClick={() => UpdateEstado(livro.id, "rascunho")}
                    className={`${styles.btn} ${styles.btnPublicar}`}
                  >
                    Cancelar Revisão (Voltar para Rascunho)
                  </button>
                )}

                {livro.estado === "publicado" && (
                  <span>
                    Publicado
                  </span>
                )}

                {livro.estado !== "em_revisao" && (
                  <button
                    onClick={() => {
                      if (confirm("Deseja inativar este livro?"))
                        InativarLivro(livro.id);
                    }}
                    className={`${styles.btn} ${styles.btnInativar}`}
                  >
                    Inativar Livro Permanentemente
                  </button>
                )}
              </div>
            </div>
          ))}
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

      <Link to="/novo-livro" className={styles.btn}>
        Novo Livro
      </Link>

      {!carregando && meta && meta.totalPages > 1 && (
        <div>
          <button
            onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaAtual === 1}
          >
            Anterior
          </button>

          <span>Página {paginaAtual} de {meta.totalPages} (Total: {meta.totalItems})</span>

          <button
            onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, meta.totalPages))}
            disabled={paginaAtual === meta.totalPages}
          >
            Próximo
          </button>
        </div>
      )}
    </main>
  );
}
