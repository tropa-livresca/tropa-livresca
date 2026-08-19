import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

    if (!livroSelecionado) {
        return <p>Livro não encontrado</p>;
    }

    const {
        titulo,
        subtitulo,
        capa,
        manuscrito,
        autor_nome,
        autor_sobrenome,
        descricao,
        idioma,
        imagens_explicitas,
        publico_alvo,
        numero_edicao,
        preco_digital,
        preco_fisico,
        colaboradores,
        direitos_de_publicacao,
        conteudo_por_IA,
    } = livroSelecionado;

    return (
        <main style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px" }}>
            <p>Título: {titulo}</p>
            <p>Subtítulo: {subtitulo}</p>
            <p>Autor: {autor_nome} {autor_sobrenome}</p>
            <p>Público-alvo: {publico_alvo}</p>
            <p>Número Edição: {numero_edicao}</p>
            <p>Preço Digital: R$ {preco_digital}</p>
            <p>Preço Físico: R$ {preco_fisico}</p>
            <p>Descrição: {descricao}</p>
            <p>Idioma: {idioma}</p>
            <p>Imagens Explícitas: {imagens_explicitas ? "Sim" : "Não"}</p>
            <p>Conteúdo por IA: {conteudo_por_IA ? "Sim" : "Não"}</p>
            <p>Direitos de Autopublicação: {direitos_de_publicacao ? "Sim" : "Não"}</p>

            {colaboradores?.length > 0 ? (
                <p>Colaboradores: {colaboradores}</p>
            ) : (
                <p>Sem colaboradores informados</p>
            )}

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

            <Link to={`/editar-livro/${id}`}>Editar Livro</Link>
            <Link to="/novo-livro">Novo Livro</Link>
            <Link to="/meuslivros">Voltar ao painel de meus livros</Link>
        </main>
    );
}
