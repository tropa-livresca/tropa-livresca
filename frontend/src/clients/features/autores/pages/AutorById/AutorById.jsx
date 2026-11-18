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
  FaUserCircle,
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
        <div className={styles.fotoContainer}>
          {autor?.imagem ? (
            <img className={styles.foto} src={autor.imagem} alt={autor.nome} />
          ) : (
            <div className={styles.semfoto}>
              <FaUserCircle aria-hidden="true" />
            </div>
          )}
        </div>

        <div className={styles.heroinfo}>
          <h1 className={styles.titulo}>{autor?.nome || "Autor anônimo"}</h1>

          <p className={styles.descricao}>
            {autor?.descricao || "Sem descrição."}
          </p>

          <div className={styles.divisor} />

          <div className={styles.redesContainer}>
            <h2 className={styles.tituloRedes}>Conecte-se com o autor</h2>

            {temRedesSociais ? (
              <div className={styles.redes}>
                {facebook && (
                  <a
                    className={styles.rede}
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebookF aria-hidden="true" />
                    <span>Facebook</span>
                  </a>
                )}

                {instagram && (
                  <a
                    className={styles.rede}
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram aria-hidden="true" />
                    <span>Instagram</span>
                  </a>
                )}

                {linkedin && (
                  <a
                    className={styles.rede}
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedinIn aria-hidden="true" />
                    <span>LinkedIn</span>
                  </a>
                )}

                {email && (
                  <a className={styles.rede} href={`mailto:${email}`}>
                    <FaEnvelope aria-hidden="true" />
                    <span>E-mail</span>
                  </a>
                )}
              </div>
            ) : (
              <p className={styles.vazioRedes}>
                Nenhuma rede social disponível no momento.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className={styles.secao}>
        <div className={styles.cabecalhoSecao}>
          <div>
            <h2 className={styles.subtitulo}>Livros publicados</h2>
            <p className={styles.textoSecao}>
              Explore as obras e descubra novas histórias.
            </p>
          </div>
        </div>

        {carregando ? (
          <div className={styles.estado}>
            <Carregando mensagem="Carregando livros..." />
          </div>
        ) : !livros || livros.length === 0 ? (
          <p className={styles.vazio}>Nenhum livro encontrado.</p>
        ) : (
          <div className={styles.livros}>
            {livros.map((livro) => (
              <article className={styles.livro} key={livro.id}>
                <Link
                  to={`/livros/${livro.id}`}
                  className={styles.linkCapa}
                  aria-label={`Ver ${livro.titulo || "livro"}`}
                >
                  <div className={styles.capaContainer}>
                    {livro.capa?.frente ? (
                      <img
                        className={styles.capa}
                        src={livro.capa.frente}
                        alt={livro.titulo || "Capa do livro"}
                      />
                    ) : (
                      <div className={styles.semcapa}>Sem imagem</div>
                    )}
                  </div>
                </Link>

                <div className={styles.infoLivro}>
                  <Link to={`/livros/${livro.id}`} className={styles.linkLivro}>
                    <h3 className={styles.livrotitulo}>
                      {livro.titulo || "Sem título"}
                    </h3>

                    {livro.subtitulo && (
                      <p className={styles.sub}>{livro.subtitulo}</p>
                    )}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {!carregando && meta?.totalPages > 1 && (
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
