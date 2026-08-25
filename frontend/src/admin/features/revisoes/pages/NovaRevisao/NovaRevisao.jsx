import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useRevisao } from "../../hooks/useRevisao.js";
import { useLivros } from "../../../livros/hooks/useLivros.js";

export default function NovaRevisao() {
    const { id } = useParams();

    const {
        nome,
        setNome,
        setManuscrito,
        apontamento,
        setApontamento,
        CriarRevisao
    } = useRevisao();

    const { BuscarLivroById, livro } = useLivros();

    useEffect(() => {
        if (id) {
            BuscarLivroById(id);
        }
    }, [BuscarLivroById, id]);

    const handleCriar = async (e) => {
        e.preventDefault();
        try {
            await CriarRevisao(id);
            alert("Revisão criada com sucesso!");
        } catch (err) {
            alert(err.message || "Erro ao criar revisão.");
        }
    };

    return (
        <main>
            {livro && (
                <div>
                    <h2>Criando revisão para: {livro.titulo}</h2>
                    {livro.subtitulo && <p>{livro.subtitulo}</p>}

                    <object data={livro.manuscrito} type="application/pdf" width="100%" height="650px">
                        <p>
                            Seu navegador não suporta a exibição de PDFs.{" "}
                            <a href={livro.manuscrito} download target="_blank" rel="noreferrer">
                                Clique aqui para baixar o arquivo.
                            </a>
                        </p>
                    </object>

                    <Link to = {`/admin/livros/visualizar/${livro.id}`}>Ver dados completos do livro</Link>
                </div>
            )}

            <form onSubmit={handleCriar}>
                <div>
                    <label>Nome da revisão:</label>
                    <input
                        type="text"
                        name="nome"
                        value={nome || ""}
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
                        onChange={(e) => setApontamento(e.target.value)}
                    />
                </div>

                <div>
                    <label>Manuscrito:</label>
                    <input
                        type="file"
                        onChange={(e) => setManuscrito(e.target.files[0])}
                    />
                </div>

                <button type="submit">Salvar Nova Revisão</button>
            </form>
        </main>
    );
}
