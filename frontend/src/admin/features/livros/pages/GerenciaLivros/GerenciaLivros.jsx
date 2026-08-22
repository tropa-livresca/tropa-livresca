import { useLivros } from "../../hooks/useLivros.js";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function GerenciaLivros() {
    const { livros, carregando, meta, buscarLivros } = useLivros();
    const [busca, setBusca] = useState("");
    const [filtro, setFiltro] = useState("");
    const [ordem, setOrdem] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);

    useEffect(() => {
        buscarLivros(paginaAtual, 12, busca, filtro, ordem);
    }, [paginaAtual, busca, buscarLivros, filtro, ordem]);

    const handleBuscar = (e) => {
        e.preventDefault();
        setPaginaAtual(1);
        buscarLivros(1, 12, busca, filtro, ordem);
    };

    const handleAlterarStatus = async (livroId, novoStatus) => {
        console.log(`Alterando livro ${livroId} para ${novoStatus}`);
    };

    return (
        <main className="container">
            <div className="header">
                <h1 className="tituloHeader">Livros publicados pela editora</h1>
            </div>

            <form className="filtroForm" onSubmit={handleBuscar}>
                <div className="buscaWrapper">
                    <FaSearch className="buscaIcon" />
                    <input
                        type="text"
                        className="inputBusca"
                        placeholder="Buscar livro"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>

                <div className="selectsGrid">
                    <select value={filtro} onChange={(e) => { setFiltro(e.target.value); setPaginaAtual(1); }}>
                        <option value="">Ordenar por</option>
                        <option value="alfabetico">Ordem Alfabética</option>
                        <option value="data">Data de Publicação</option>
                    </select>

                    <select value={ordem} onChange={(e) => { setOrdem(e.target.value); setPaginaAtual(1); }}>
                        <option value="ascendente">Crescente / Antigos</option>
                        <option value="descendente">Decrescente / Recentes</option>
                    </select>

                    <button type="submit" className="btn" style={{ margin: 0, padding: "0.75rem 2rem", borderRadius: "999px" }}>
                        Buscar
                    </button>
                </div>
            </form>

            {carregando ? (
                <p>Carregando...</p>
            ) : !livros || livros.length === 0 ? (
                <div className="cardnenhumlivro">
                    <FaSearch size={40} />
                    <h3 className="titulon">Nenhum livro encontrado</h3>
                    <p className="sub">Tente mudar os termos da busca ou os filtros aplicados.</p>
                </div>
            ) : (
                <div className="tabelaLinhas">
                    {livros.map((livro) => (
                        <div className="linhaLivro" key={livro.id}>
                            <div className="infoColuna">
                                <div className="capaContainer">
                                    {livro?.capa?.frente ? (
                                        <img src={livro.capa.frente} alt={livro.titulo} className="capaMini" />
                                    ) : (
                                        <div className="semCapaMini">📖</div>
                                    )}
                                </div>
                                <div className="detalhesTexto">
                                    <h3 className="livroTitulo">{livro.titulo || "Sem título"}</h3>
                                    <span className="sub">
                                        {livro.autor_nome} {livro.autor_sobrenome}
                                    </span>
                                    {livro.status && (
                                        <span className={`badge ${livro.status.toLowerCase()}`}>
                                            {livro.status.replace("_", " ")}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="acoesColuna">
                                <Link to={`/admin/livros/detalhes/${livro.id}`} className="btnAcao btnVisualizar">
                                    Ver Livro
                                </Link>

                                {livro.status === "rascunho" && (
                                    <Link to={`/admin/livros/revisao/${livro.id}`} className="btnAcao btnEditar">
                                        Fazer a revisão do livro
                                    </Link>
                                )}

                                {livro.status === "em_revisao" && (
                                    <button
                                        onClick={() => handleAlterarStatus(livro.id, "publicado")}
                                        className="btnAcao btnPublicar"
                                    >
                                        Publicar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!carregando && meta && meta.totalPages > 1 && (
                <div className="paginacao">
                    <button
                        className="btnPaginacao"
                        onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                        disabled={paginaAtual === 1}
                    >
                        Anterior
                    </button>
                    <span className="textoPaginacao">
                        Página {paginaAtual} de {meta.totalPages} (Total: {meta.totalItems})
                    </span>
                    <button
                        className="btnPaginacao"
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
