import { useState, useEffect } from "react";
//import styles from "./PainelCategoria.module.css";
import { Link } from "react-router-dom";
import { useCategoria } from "../../hooks/useCategoria.js";
import { FaSearch } from "react-icons/fa";

export default function PainelCategoria() {
    const { categorias, carregando, meta, InativarCategoria, BuscarCategorias } = useCategoria();

    const [busca, setBusca] = useState("");
    const [filtro, setFiltro] = useState("");
    const [ordem, setOrdem] = useState("");
    const [tipo, setTipo] = useState("");
    
    const [paginaAtual, setPaginaAtual] = useState(1);

    useEffect(() => {
        const carregarDados = async () => {
            await BuscarCategorias(paginaAtual, 12, busca, filtro, ordem);
        }
        carregarDados();
    }, [paginaAtual, filtro, ordem, busca, BuscarCategorias]);

    const handleBuscar = (e) => {
        e.preventDefault();
        setPaginaAtual(1);
        BuscarCategorias(1, 12, busca, filtro, ordem);
    }

    return (
        <main>
            <h1>Categorias cadastradas</h1>

            <form onSubmit={handleBuscar}>
                <span>
                    <FaSearch />
                </span>

                <input
                    type="text"
                    placeholder="Buscar livro"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />

                <select value={filtro} onChange={(e) => { setFiltro(e.target.value); setPaginaAtual(1); }}>
                    <option value="">Ordenar por</option>
                    <option value="alfabetico">Ordem Alfabética</option>
                    <option value="data">Data de Publicação</option>
                </select>

                <select value={ordem} onChange={(e) => { setOrdem(e.target.value); setPaginaAtual(1); }}>
                    <option value="ascendente">Crescente / Antigos</option>
                    <option value="descendente">Decrescente / Recentes</option>
                </select>

                <select value={tipo} onChange={(e) => { setTipo(e.target.value); setPaginaAtual(1); }}>
                    <option value="livro">Livro</option>
                    <option value="funcao">Funcão</option>
                </select>

                <button type="submit">Buscar</button>
            </form>

            {carregando ? (
                <p>Carregando...</p>
            ) : !categorias || categorias.length === 0 ? (<p>Nenhuma categoria encontrada.</p>) : (
                categorias.map((categoria) => {
                    return (
                        <div key={categoria.id}>
                            <div>
                                <p>Nome:{categoria.nome}</p>
                                
                                <p>{categoria.descricao}</p>

                                <p>{categoria.tipo}
                                </p>
                            </div>
                            <button onClick={InativarCategoria(categoria.id)}>Inativar Categoria</button>

                            <button><Link to={`/admin/categoria/${categoria.id}`}>Ver Categoria</Link></button>

                            <button><Link to = {`/admin/categoria/editar/${categoria.id}`}>Editar Categoria</Link></button>
                        </div>
                    );
                })
            )}

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
        </main>)
}