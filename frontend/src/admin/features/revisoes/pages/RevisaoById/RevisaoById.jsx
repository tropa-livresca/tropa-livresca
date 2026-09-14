import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRevisao } from "../../hooks/useRevisao.js";

export default function RevisaoById() {
    const { id } = useParams();
    const {
        BuscarRevisaoById,
        revisaoAtual,
        livro,
        nome,
        setNome,
        manuscrito,
        setManuscrito,
        apontamento,
        setApontamento,
        AtualizarRevisao,
        LimparCampos
    } = useRevisao();

    const [isEdicao, setIsEdicao] = useState(false);

    useEffect(() => {
        if (!id) return;

        const CarregarDados = async () => {
            await BuscarRevisaoById(id);
        };

        CarregarDados();
    }, [id, BuscarRevisaoById]);

    const executarSalvar = async (e) => {
        e.preventDefault();
        if (id) {
            await AtualizarRevisao(id, e);
            setIsEdicao(false);
        }
    };

    return (
        <main>
            <button onClick={() => setIsEdicao(!isEdicao)}>
                {isEdicao ? "Cancelar" : "Editar"}
            </button>

            <Link to = "/admin/revisoes">Voltar às Revisões</Link>

            {revisaoAtual ? (
                <form onSubmit={executarSalvar}>
                    <div>
                        {livro?.id && (
                            <Link to={`/admin/livros/visualizar/${livro.id}`}>
                                Ver livro relacionado
                            </Link>
                        )}
                    </div>

                    <div>
                        <label>Nome da revisão:</label>
                        <input
                            type="text"
                            name="nome"
                            value={nome || ""}
                            disabled={!isEdicao}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Apontamento:</label>
                        <textarea
                            id="apontamento"
                            name="apontamento"
                            rows="10"
                            cols="50"
                            placeholder="Digite o apontamento"
                            value={apontamento || ""}
                            disabled={!isEdicao}
                            onChange={(e) => setApontamento(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Manuscrito:</label>
                        <input
                            type="file"
                            disabled={!isEdicao}
                            onChange={(e) => setManuscrito(e.target.files[0])}
                        />
                        {manuscrito && typeof manuscrito === "string" && (
                            <p>Arquivo atual: <a href={manuscrito} target="_blank" rel="noreferrer">Visualizar</a></p>
                        )}
                    </div>

                    {isEdicao && <div>
                        <button type="button" onClick={LimparCampos}>Limpar Formulário</button>
                        <button type="submit">Salvar Alterações</button>
                    </div>}
                </form>
            ) : (
                <p>Nenhuma revisão encontrada para este id.</p>
            )}
        </main>
    );
}
