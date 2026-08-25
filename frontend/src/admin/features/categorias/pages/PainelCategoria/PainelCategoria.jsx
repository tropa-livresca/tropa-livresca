import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCategoria } from "../../hooks/useCategoria.js";
import { FaSearch } from "react-icons/fa";
import Carregando from "../../../../../clients/components/Carregando/Carregando";

export default function PainelCategoria() {
    const { categorias, carregando, meta, InativarCategoria, BuscarCategorias } = useCategoria();

    const [busca, setBusca] = useState("");
    const [filtro, setFiltro] = useState("");
    const [ordem, setOrdem] = useState("");
    const [tipo, setTipo] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);

    useEffect(() => {
        BuscarCategorias(paginaAtual, 12, busca, filtro, ordem, tipo);
    }, [paginaAtual, filtro, ordem, tipo, BuscarCategorias]);

    const handleBuscar = (e) => {
        e.preventDefault();
        if (paginaAtual === 1) {
            BuscarCategorias(1, 12, busca, filtro, ordem, tipo);
        } else {
            setPaginaAtual(1);
        }
    };

    return (
        <main>
            <h1>Categorias cadastradas</h1>

            <button><Link to="/admin/categoria/nova">Nova Categoria</Link></button>

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
                    <option value="">Direção</option>
                    <option value="ascendente">Crescente / Antigos</option>
                    <option value="descendente">Decrescente / Recentes</option>
                </select>

                <select value={tipo} onChange={(e) => { setTipo(e.target.value); setPaginaAtual(1); }}>
                    <option value="">Todos os tipos</option>
                    <option value="livro">Livro</option>
                    <option value="funcao">Função</option>
                </select>

                <button type="submit">Buscar</button>
            </form>

            {carregando ? (
                <Carregando mensagem="Carregando..."/>
            ) : !categorias || categorias.length === 0 ? (
                <p>Nenhuma categoria encontrada.</p>
            ) : (
                categorias.map((categoria) => {
                    return (
                        <div key={categoria.id}>
                            <div>
                                <p>Nome: {categoria.nome}</p>
                                <p>{categoria.descricao}</p>
                                <p>{categoria.tipo}</p>
                            </div>
                            <button><Link to = {`/admin/categoria/${categoria.id}`}>Ver Categoria</Link></button>
                            <button onClick={() => InativarCategoria(categoria.id)}>Inativar Categoria</button>
                            <button><Link to={`/admin/categoria/alterar/${categoria.id}`}>Editar Categoria</Link></button>
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
        </main>
    );
}
