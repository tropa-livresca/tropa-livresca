import useLivros from "../../../hooks/useLivros";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export default function LivroById() {
    const { id } = useParams();
    const { autor, colaboradores, livro, BuscarLivroByAutor, carregando } = useLivros();

    useEffect(() => {
        if (id) {
            BuscarLivroByAutor(id);
        }
    }, [id, BuscarLivroByAutor]); 

    if (carregando) return <p>Carregando...</p>;

    if (!livro) return <p>Livro não encontrado.</p>;

    return (
        <main>
            <section>
                {livro?.capa ? (
                    <img src={livro.capa} alt={livro.titulo} />
                ) : (
                    <div>Sem foto</div>
                )}

                <div>
                    <h1>{livro?.titulo}</h1>
                    {livro?.subtitulo && (
                        <h2>{livro.subtitulo}</h2>
                    )}

                    <h3>Sinopse do livro</h3>
                    <p>{livro?.descricao}</p>
                </div>

                <div>
                    <p>Publicado por: {autor?.nome || "Autor desconhecido"}</p>
                    <p>Data de publicação: {livro?.data_de_publicacao}</p>
                    <p>Público-alvo: {livro?.publico_alvo}</p>
                </div>
            </section>

            {autor && (
                <section>
                    <h2>Perfil do Autor</h2>
                    <article>
                        <h3>{autor.nome}</h3>
                        {autor.imagem_perfil && (
                            <img src={autor.imagem_perfil} alt={autor.nome} />
                        )}
                        <Link to={`/autores/${autor.id}`}>Ver Perfil</Link>
                    </article>
                </section>
            )}

            {colaboradores && colaboradores.length > 0 && (
                <section>
                    <h2>Relação dos colaboradores</h2>
                    <ul>
                        {colaboradores.map((colaborador, index) => (
                            <li key={`${colaborador.nome}-${index}`}>
                                {colaborador.nome} {colaborador.sobrenome} - {colaborador.funcao}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </main>
    );
}
