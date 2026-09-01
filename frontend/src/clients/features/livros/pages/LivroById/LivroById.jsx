import { useLivros } from "../../../../hooks/useLivros";
import styles from "./LivroById.module.css";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Carregando from "../../../../components/Carregando/Carregando";

export default function LivroById() {
    const { id } = useParams();
    const { autor, colaboradores, livro, BuscarDetalhesLivro, carregando } = useLivros();

    useEffect(() => {
        if (id) {
            BuscarDetalhesLivro(id);
        }
    }, [id, BuscarDetalhesLivro]);

    if (carregando) return <Carregando mensagem="Carregando livro..."/>;

    if (!livro) return <p>Livro não encontrado.</p>;

    return (
        <main className={styles.container}>
            <section className={styles.hero}>
                {livro?.capa?.frente ? (
                    <img className={styles.foto}
                        src={livro.capa.frente} alt={livro.titulo} />
                ) : (
                    <div className={styles.semfoto}>Sem foto</div>
                )}

                <div className={styles.heroinfo}>
                    <h1 className={styles.titulo}>Título:{livro?.titulo}</h1>
                    {livro?.subtitulo && (
                        <h2 className = {styles.subtitulo}>Subtítulo{livro.subtitulo}</h2>
                    )}

                    <span></span>

                    <h2 className={styles.subtitulo}>Sinopse do livro</h2>
                    <p className={styles.descricao}>{livro?.descricao}</p>
                </div>

                <div>
                    <p className={styles.descricao}>Publicado por: {autor?.nome || "Autor desconhecido"}</p>
                    <p className={styles.descricao}>Data de publicação: {livro?.data_de_publicacao}</p>
                    <p className={styles.descricao}>Público-alvo: {livro?.publico_alvo}</p>
                </div>

                <div>
                    <p>Número edição: {livro?.numero_edicao || "Sem número de edição"}</p>
                    <p>Feito com IA?: {livro?.conteudo_por_IA ? "Sim" : "Não"}</p>
                    <p>Idioma: {livro?.idioma || "Idioma não renderizado"}</p>
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
                    <h2 className = {styles.subtitulo}>Relação dos colaboradores</h2>
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
