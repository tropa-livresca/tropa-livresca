import { useLivros } from "../../hooks/useLivros.js";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./GerenciaLivros.module.css";

export default function GerenciaLivros() {
    const { livros, carregando, count, buscarLivros } = useLivros();
    const [busca, setBusca] = useState("");
    const [filtro, setFiltro] = useState("");
    const [ordem, setOrdem] = useState("");
    const [estado, setEstado] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);

    const itensPorPagina = 12;
    const totalPages = count ? Math.ceil(count / itensPorPagina) : 1;

    useEffect(() => {
        buscarLivros(paginaAtual, 12, busca, filtro, ordem, estado);
    }, [paginaAtual, buscarLivros, filtro, ordem, estado]);

    const handleBuscar = (e) => {
        e.preventDefault();
        setPaginaAtual(1);
        buscarLivros(1, 12, busca, filtro, ordem, estado);
    };

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.tituloHeader}>Livros publicados pela editora</h1>
            </div>

            <form className={styles.filtroForm} onSubmit={handleBuscar}>
                <div className={styles.buscaWrapper}>
                    <FaSearch className={styles.buscaIcon} />
                    <input
                        type="text"
                        className={styles.inputBusca}
                        placeholder="Buscar livro"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>

                <div className={styles.selectsGrid}>
                    <select value={filtro} onChange={(e) => { setFiltro(e.target.value); setPaginaAtual(1); }}>
                        <option value="">Ordenar por</option>
                        <option value="alfabetico">Ordem Alfabética</option>
                        <option value="data">Data de Publicação</option>
                    </select>

                    <select value={ordem} onChange={(e) => { setOrdem(e.target.value); setPaginaAtual(1); }}>
                        {filtro === "" || filtro === "alfabetico" ? (<div>
                            <option value="ascendente">Crescente</option>
                            <option value="descendente">Decrescente</option></div>) : (<div>
                                <option value="ascendente">Antigos</option>
                                <option value="descendente">Mais Recentes</option></div>)}
                    </select>

                    <select value={estado} onChange={(e) => { setEstado(e.target.value); setPaginaAtual(1); }}>
                        <option value="">Todos</option>
                        <option value="publicado">Publicados</option>
                        <option value="em_revisao">Para revisão</option>
                    </select>

                    <button type="submit" className={styles.btn}>
                        Buscar
                    </button>
                </div>

                <div className={styles.totalEncontrado}>Livros encontrados: {count}</div>
            </form>

            {carregando ? (
                <p>Carregando...</p>
            ) : !livros || livros.length === 0 ? (
                <div className={styles.cardnenhumlivro}>
                    <FaSearch size={40} />
                    <h3 className={styles.titulon}>Nenhum livro encontrado</h3>
                    <p className={styles.sub}>Tente mudar os termos da busca ou os filtros aplicados.</p>
                </div>
            ) : (
                <div className={styles.tabelaContainer}>
                    <table className={styles.tabelaLivros}>
                        <thead>
                            <tr>
                                <th>Capa</th>
                                <th>Título</th>
                                <th>Autor</th>
                                <th>Data de Publicação</th>
                                <th>Estado</th>
                                <th>Revisão</th>
                                <th style={{ textAlign: "center" }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {livros.map((livro) => {
                                let capaObjeto = null;
                                try {
                                    capaObjeto = typeof livro.capa === "string" ? JSON.parse(livro.capa) : livro.capa;
                                } catch (e) {
                                    console.error("Erro ao converter capa JSONB:", e);
                                }

                                return (
                                    <tr key={livro.id}>
                                        <td>
                                            <div className={styles.capaContainer}>
                                                {capaObjeto ? (
                                                    <img src={capaObjeto.frente} alt={livro.titulo} className={styles.capaMini} />
                                                ) : (
                                                    <div className={styles.semCapaMini}>📖</div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.detalhesTexto}>
                                                <h3 className={styles.livroTitulo}>{livro.titulo || "Sem título"}</h3>
                                                <span className={styles.sub}>
                                                    {livro.autor_nome} {livro.autor_sobrenome}
                                                </span>
                                            </div>
                                        </td>
                                        <td><Link to={`admin/autores/${livro.fk_user_profile_id}`}>{livro.autor_nome} {livro.autor_sobrenome}</Link></td>
                                        <td>{livro.data_de_publicacao}</td>
                                        <td>
                                            {livro.estado === "em_revisao" ? (
                                                <span>Nâo publicado</span>
                                            ) : (<span>Publicado</span>)}
                                        </td>

                                        <td>
                                            {livro.estado === "em_revisao" ? (<span>Em revisão</span>) : (<span>Revisto</span>)}
                                        </td>

                                        <td>
                                            <div className={styles.acoesColuna}>
                                                <Link to={`/admin/livros/detalhes/${livro.id}`} className={`${styles.btnAcao} ${styles.btnVisualizar}`}>
                                                    Ver Livro
                                                </Link>

                                                {livro.estado === "em_revisao" && (
                                                    <Link to={`/admin/livros/revisoes/nova-revisao/${livro.id}`} className={`${styles.btnAcao} ${styles.btnEditar}`}>
                                                        Revisar
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {!carregando && totalPages > 1 && (
                <div className={styles.paginacao}>
                    <button
                        className={styles.btnPaginacao}
                        onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                        disabled={paginaAtual === 1}
                    >
                        Anterior
                    </button>
                    <span className={styles.textoPaginacao}>
                        Página {paginaAtual} de {totalPages} (Total: {count})
                    </span>
                    <button
                        className={styles.btnPaginacao}
                        onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPages))}
                        disabled={paginaAtual === totalPages}
                    >
                        Próximo
                    </button>
                </div>
            )}
        </main>
    );
}
