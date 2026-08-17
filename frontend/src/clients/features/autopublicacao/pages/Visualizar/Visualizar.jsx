import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMeusLivros } from "../../hooks/useMeusLivros.js";

export default function Visualizar() {
    const { id } = useParams();
    const { buscarLivroById, carregando, livroSelecionado } = useMeusLivros();

    useEffect(() => {
        if (id) {
            buscarLivroById(id);
        }
    }, [id, buscarLivroById]);

    if (carregando) {
        return <p>Carregando manuscrito...</p>;
    }

    if (!livroSelecionado || !livroSelecionado.conteudo) {
        return <p>Livro não encontrado</p>;
    }

    const { capa, manuscrito } = livroSelecionado.conteudo;

    return (
        <main style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px" }}>
            {capa?.frente && (
                <img src={capa.frente} alt="Capa Frente" style={{ maxWidth: "300px" }} />
            )}

            {manuscrito && (
                <object
                    data={manuscrito}
                    type="application/pdf"
                    width="100%"
                    height="650px"
                >
                    <p>
                        Seu navegador não suporta a exibição de PDFs.{" "}
                        <a href={manuscrito} download target="_blank" rel="noreferrer">
                            Clique aqui para baixar o arquivo.
                        </a>
                    </p>
                </object>
            )}

            {capa?.verso && (
                <img src={capa.verso} alt="Capa Verso" style={{ maxWidth: "300px" }} />
            )}
        </main>
    );
}
