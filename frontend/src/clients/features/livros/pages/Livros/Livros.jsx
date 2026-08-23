import { useLivros } from "../../../../hooks/useLivros";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Carregando from "../../../../components/Carregando/Carregando";

export default function Livros() {
    const { Livros, BuscarLivros, carregando, meta } = useLivros();

    const [busca, setBusca] = useState("");
    const [filtro, setFiltro] = useState("");
    const [ordem, setOrdem] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);

    useEffect(() => {
        const carregarDados = async () => {
            await BuscarLivros(paginaAtual, 12, busca, filtro, ordem);
        }
        carregarDados();
    }, [paginaAtual, filtro, ordem, busca, BuscarLivros]);

    const handleBuscar = (e) => {
        e.preventDefault();
        setPaginaAtual(1);
        BuscarLivros(1, 12, busca, filtro, ordem);
    }

    return (
        <main>
            <h1>Livros publicados pela editora</h1>

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

                <button type="submit">Buscar</button>
            </form>

            {carregando ? (
                <Carregando mensagem="Carregando livros..."/>
            ) : !Livros || Livros.length === 0 ? (
                <p>Nenhum livro encontrado</p>
            ) : (
                Livros.map((livro) => {
                    return (
                        <div key={livro.id}>
                            {livro?.capa?.frente ? (
                                <img src={livro.capa.frente} alt={livro.titulo} width="100" />
                            ) : (
                                <div>Sem imagem</div>
                            )}
                            <h3>{livro.titulo || "Sem título"}</h3>
                            <p>{livro.autor_nome || "Sem autor"}</p>
                            <p>{livro.autor_sobrenome || "Sem sobrenome"}</p>
                            <Link to={`/livros/detalhes/${livro.id}`}>Ver Livro</Link>
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
    )
}
