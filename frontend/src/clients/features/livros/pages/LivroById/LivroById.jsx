import { useLivros } from "../../../../hooks/useLivros";
import styles from "./LivroById.module.css";
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

    if (!livro) return <p>Livro nÃ£o encontrado.</p>;

    return (
        <main className={styles.container}>
            <section className={styles.hero}>
                {livro?.capa ? (
                    <img className={styles.foto}
                        src={livro.capa} alt={livro.titulo} />
                ) : (
                    <div className={styles.semfoto}>Sem foto</div>
                )}

                <div className={styles.heroinfo}>
                    <h1 className={styles.titulo}>{livro?.titulo}</h1>
                    {livro?.subtitulo && (
                        <h2 className = {styles.subtitulo}>{livro.subtitulo}</h2>
                    )}

                    <span></span>

                    <h2 className={styles.subtitulo}>Sinopse do livro</h2>
                    <p className={styles.descricao}>{livro?.descricao}</p>
                </div>

                <div>
                    <p className={styles.descricao}>Publicado por: {autor?.nome || "Autor desconhecido"}</p>
                    <p className={styles.descricao}>Data de publicaÃ§Ã£o: {livro?.data_de_publicacao}</p>
                    <p className={styles.descricao}>PÃºblico-alvo: {livro?.publico_alvo}</p>
                </div>
            </section>

            <section className={styles.secao}>
                <h2 className = {styles.subtitulo}>Perfil do Autor</h2>
                {autor && (
                    <div className = {styles.livros}>
                        <article className = {styles.livro}>
                            <h3>{autor.nome}</h3>
                            {autor.imagem_perfil && (
                                <img className = {styles.capa} src={autor.imagem_perfil} alt={autor.nome} />
                            )}
                            <Link to={`/autores/${autor.id}`} className = {styles.btnlivro}>Ver Perfil</Link>
                        </article>
                    </div>
                )}
            </section>
            
            {colaboradores && colaboradores.length > 0 && (
                <section className = {styles.secao}>
                    <h2 className = {styles.subtitulo}>RelaÃ§Ã£o dos colaboradores</h2>
                    <ul>
                        {colaboradores.map((colaborador, index) => (
                            <li className = {styles.descricao}
                            key={`${colaborador.nome}-${index}`}>
                                {colaborador.nome} {colaborador.sobrenome} - {colaborador.funcao}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </main>
    );
}


