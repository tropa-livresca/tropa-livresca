import styles from "./AutorById.module.css";
import { useAutores } from "../../../../hooks/useAutores";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Carregando from "../../../../components/Carregando/Carregando";

export default function AutorById() {
  const { id } = useParams();
  const { autor, redesSociais, livros, carregando, meta, buscarAutorById } =
    useAutores();
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    setPaginaAtual(1);
  }, [id]);

  useEffect(() => {
    if (id) {
      buscarAutorById(id, paginaAtual, 6);
    }
  }, [id, paginaAtual, buscarAutorById]);

  const { facebook, instagram, linkedin, email } = redesSociais || {};
  const temRedesSociais = facebook || instagram || linkedin || email;

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
          <p className={styles.descricao}>
            {autor?.descricao || "Sem descrição."}
          </p>
        </div>
      </section>

      <section className={styles.secao}>
        <h2 className={styles.subtitulo}>Redes Sociais</h2>
        {temRedesSociais ? (
          <div className={styles.redes}>
            {facebook && (
              <a
                className={styles.rede}
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF aria-hidden="true" /> Facebook
              </a>
            )}
            {instagram && (
              <a
                className={styles.rede}
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram aria-hidden="true" /> Instagram
              </a>
            )}
            {linkedin && (
              <a
                className={styles.rede}
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn aria-hidden="true" /> LinkedIn
              </a>
            )}
            {email && (
              <a className={styles.rede} href={`mailto:${email}`}>
                <FaEnvelope aria-hidden="true" /> E-mail
              </a>
            )}
          </div>
        ) : (
          <p className={styles.vazio}>Sem redes sociais disponíveis.</p>
        )}
      </section>

      <section className={styles.secao}>
        <h2 className={styles.subtitulo}>Alguns Livros do Autor</h2>

        {carregando ? (
          <Carregando mensagem="Carregando perfil do autor..." />
        ) : !livros || livros.length === 0 ? (
          <p className={styles.vazio}>Nenhum livro encontrado</p>
        ) : (
          <div className={styles.livros}>
            {livros.map((livro) => (
              <article className={styles.livro} key={livro.id}>
                {livro.capa?.frente ? (
                  <img
                    className={styles.capa}
                    src={livro.capa.frente}
                    alt={livro.titulo}
                  />
                ) : (
                  <div className={styles.semcapa}>Sem foto da capa</div>
                )}
                <h3 className={styles.livrotitulo}>{livro.titulo}</h3>
                <p className={styles.livrosubtitulo}>{livro.subtitulo}</p>
                <Link to={`/livros/${livro.id}`} className={styles.btnlivro}>
                  Ver Livro
                </Link>
              </article>
            ))}
          </div>
        )}

        {meta?.totalPages > 1 && (
          <nav
            className={styles.paginacaoLivros}
            aria-label="Paginação dos livros"
          >
            <button
              className={styles.btnSeta}
              type="button"
              onClick={() =>
                setPaginaAtual((pagina) => Math.max(pagina - 1, 1))
              }
              disabled={paginaAtual === 1}
              aria-label="Ver livros anteriores"
              title="Ver livros anteriores"
            >
              <FaChevronLeft aria-hidden="true" />
            </button>
            <span className={styles.indicadorPagina} aria-live="polite">
              {paginaAtual} / {meta.totalPages}
            </span>
            <button
              className={styles.btnMais}
              type="button"
              onClick={() =>
                setPaginaAtual((pagina) =>
                  Math.min(pagina + 1, meta.totalPages),
                )
              }
              disabled={paginaAtual === meta.totalPages}
            >
              Ver mais livros
              <FaChevronRight aria-hidden="true" />
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}
