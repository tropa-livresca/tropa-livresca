import styles from "./AutorById.module.css";

import { useAutor } from "../../../hooks/useAutor";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaEnvelope } from "react-icons/fa";

import Paginacao from "../../../components/layout/Paginacao/Paginacao";

export default function AutorById() {
    const { id } = useParams();
    const { autor, instagram, linkedin, facebook, email, redes, livros, carregando, meta, buscarAutorById } = useAutor();

    const [paginaAtual, setPaginaAtual] = useState(1);

    useEffect(() => {
        if (id) buscarAutorById(id, paginaAtual, 3);
    }, [id, paginaAtual]);

    if (carregando) return <p>Carregando...</p>

    return (
        <main className={styles.container}>
            <section className={styles.hero}>
                {autor?.imagem ? (
                    <img className={styles.foto} src={autor.imagem} alt={autor.nome} />
                ) : (
                    <div className={styles.semfoto}>Sem foto</div>
                )}

                <div className={styles.heroinfo}>
                    <h1 className={styles.titulo}>{autor?.nome}</h1>
                    <p className={styles.descricao}>{autor?.descricao || "Sem descrição."}</p>
                </div>
            </section>

            <section className={styles.secao}>
                <h2 className={styles.subtitulo}>Redes Sociais</h2>

                {redes && redes.length > 0 ? (
                    <div className={styles.redes}>
                        {facebook && (
                            <a className={styles.rede} href={facebook} target="_blank" rel="noopener noreferrer">
                                <FaFacebookF aria-hidden="true" />
                                Facebook
                            </a>
                        )}

                        {instagram && (
                            <a className={styles.rede} href={instagram} target="_blank" rel="noopener noreferrer">
                                <FaInstagram aria-hidden="true" />
                                Instagram
                            </a>
                        )}

                        {linkedin && (
                            <a className={styles.rede} href={linkedin} target="_blank" rel="noopener noreferrer">
                                <FaLinkedinIn aria-hidden="true" />
                                LinkedIn
                            </a>
                        )}

                        {email && (
                            <a className={styles.rede} href={`mailto:${email}`}>
                                <FaEnvelope aria-hidden="true" />
                                E-mail
                            </a>
                        )}
                    </div>
                ) : (
                    <p className={styles.vazio}>Sem redes sociais disponíveis.</p>
                )}
            </section>

            <section className={styles.secao}>
                <h2 className={styles.subtitulo}>Livros</h2>

                {!livros || livros.length === 0 ? (
                    <p className={styles.vazio}>Nenhum livro encontrado</p>
                ) : (
                    <div className={styles.livros}>
                        {livros.map((livro) => {
                            return (
                                <article className={styles.livro} key={livro.id}>
                                    {livro.capa ? (
                                        <img className={styles.capa} src={livro.capa} alt={livro.titulo} />
                                    ) : (
                                        <div className={styles.semcapa}>Sem foto da capa</div>
                                    )}

                                    <h3 className={styles.livrotitulo}>{livro.titulo}</h3>
                                    <p className={styles.livrosubtitulo}>{livro.subtitulo}</p>

                                    <Link to={`/livros`} className={styles.btnlivro}>Ver Livros</Link>
                                </article>
                            );
                        })}
                    </div>
                )}

                <Paginacao
                    paginaAtual={paginaAtual}
                    totalPaginas={meta?.totalPages}
                    totalItems={meta?.totalItems}
                    onMudarPagina={setPaginaAtual}
                />
            </section>
        </main>
    );
}
