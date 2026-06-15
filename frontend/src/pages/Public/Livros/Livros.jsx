import useLivros from "../../../hooks/useLivros";
<<<<<<< HEAD
=======
import {Link} from "react-router-dom";
>>>>>>> 13be55e422a83260af3d0e1674b15d601ae89ef0
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Livros() {
    const { Livros, setLivros, BuscarLivros, carregando, meta } = useLivros();

    const [busca, setBusca] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);

    useEffect(() => {
        const carregarDados = async () => {
            await BuscarLivros(paginaAtual, 12, busca);
        }
        carregarDados();
<<<<<<< HEAD
    }, [paginaAtual,BuscarLivros]);
=======
    }, [paginaAtual, BuscarLivros]);
>>>>>>> 13be55e422a83260af3d0e1674b15d601ae89ef0

    const handleBuscar = (e) => {
        e.preventDefault();
        setPaginaAtual(1);
        BuscarLivros(1, 12, busca);
    }

    if (carregando) return <p>Carregando</p>

    return (
        <main>
            <h1>Livros publicados pela editora</h1>

            <form>
                <span>
                    <FaSearch />
                </span>

                <input
                    type="text"
                    placeholder="Buscar livro"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />

                <button type="submit" onClick={handleBuscar}>Buscar</button>
            </form>

            {!Livros || Livros.length === 0 ? (<p>Nenhum autor encontrado</p>) : (
                Livros.map((livro) => {
                    return (
<<<<<<< HEAD
                        <div key={livro.id}>
                            {livro.capa ? (<img src={livro.capa} alt={livro.titulo} width="100" />) : (<div>Sem imagem</div>)}
                            <h3>{livro.titulo || "Sem título"}</h3>
                            <p>{livro.descricao || "Sem descrição"}</p>
                            <p>{livro.autor_nome || "Sem autor"}</p>
                            <p>{livro.autor_sobrenome || "Sem sobrenome"}</p>
=======
                        <div>
                            <div key={livro.id}>
                                {livro.capa ? (<img src={livro.capa} alt={livro.titulo} width="100" />) : (<div>Sem imagem</div>)}
                                <h3>{livro.titulo || "Sem título"}</h3>
                                <p>{livro.autor_nome || "Sem autor"}</p>
                                <p>{livro.autor_sobrenome || "Sem sobrenome"}</p>
                                <Link to={`/livros/${livro.id}`}>Ver Livro</Link>
                            </div>
>>>>>>> 13be55e422a83260af3d0e1674b15d601ae89ef0
                        </div>
                    );
                })
            )}

            {meta && meta.totalPages > 1 && (
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