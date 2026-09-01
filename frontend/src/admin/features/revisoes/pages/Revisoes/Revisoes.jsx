import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRevisao } from "../../hooks/useRevisao.js";
import { FaSearch } from "react-icons/fa";
import Paginacao from "../../../../../common/components/Paginacao/Paginacao.jsx";

export default function Revisoes() {
    const { revisoes, count, carregando, BuscarRevisoes } = useRevisao();

    const [busca, setBusca] = useState("");
    const [filtro, setFiltro] = useState("");
    const [ordem, setOrdem] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);

    const itensPorPagina = 12;
    const totalPages = count ? Math.ceil(count / itensPorPagina) : 1;

    useEffect(() => {
        const carregarDados = async () => {
            await BuscarRevisoes(paginaAtual, 12, busca, filtro, ordem);
        }
        carregarDados();
    }, [paginaAtual, filtro, ordem, BuscarRevisoes]);

    const handleBuscar = (e) => {
        e.preventDefault();
        setPaginaAtual(1);
        BuscarRevisoes(1, 12, busca, filtro, ordem);
    }

    return (
        <main>
            <h1>Revisões</h1>

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

            {
                carregando ? (
                    <p>Carregando...</p>
                ) : !revisoes || revisoes.length === 0 ? (
                    <p>Nenhum rascunho encontrado</p>
                ) : (
                    revisoes.map((revisao) => {
                        const livro = revisao.livros;
                        return (
                            <div key={revisao.id}>
                                <ul>
                                    <li>Id do livro: {livro?.id || "Sem id"}</li>
                                    <li>
                                        {livro?.capa?.frente ? (
                                            <img
                                                src={livro.capa.frente}
                                                alt={`Capa do livro ${livro?.titulo}`}
                                                style={{ width: "100px", height: "auto" }}
                                            />
                                        ) : (
                                            "Sem capa encontrada"
                                        )}
                                    </li>
                                    <li>Título: {livro?.titulo || "Sem título"}</li>
                                    <li>Subtítulo: {livro?.subtitulo || "Sem subtítulo"}</li>
                                    <li>Nome: {revisao.nome}</li>
                                    <li>Apontamento: {revisao.apontamento}</li>
                                    <li>Data: {revisao.data}</li>
                                </ul>
                                <Link to={`/admin/livros/revisoes/visualizar/${revisao.id}`}>Ver Revisão</Link>
                                {livro?.id && (
                                    <Link to={`/admin/livros/visualizar/${livro.id}`}>Ver livro revisto</Link>
                                )}
                            </div>
                        );
                    })
                )
            }

            {!carregando && totalPages > 1 && (
                <Paginacao paginaAtual={paginaAtual}
                    totalPaginas={totalPages}
                    totalItems={itensPorPagina}
                    onMudarPagina={setPaginaAtual}
                />)}
        </main>
    )
};
