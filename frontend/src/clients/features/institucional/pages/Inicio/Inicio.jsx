import styles from "./Inicio.module.css";
import { Link } from "react-router-dom";
import { useAutores } from "../../../../hooks/useAutores";
import { useLivros } from "../../../../hooks/useLivros";
import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaArrowRight,
  FaArrowLeft,
  FaFileAlt,
  FaSpellCheck,
  FaRocket,
  FaPenFancy,
} from "react-icons/fa";

const slidesCarrossel = [
  {
    tag: "Autopublicação de Alto Nível",
    titulo: "Seu livro merece uma edição de verdade",
    texto:
      "Revisão e distribuição em um só lugar, com acompanhamento de quem entende do mercado.",
    botao: "Publicar meu Projeto",
    link: "/sobreautopublicacao",
  },
  {
    tag: "Catálogo",
    titulo: "Conheça as obras da Tropa Livresca",
    texto:
      "Histórias de autores independentes em formato físico e digital, prontas para chegar até você.",
    botao: "Ver livros publicados",
    link: "/loja",
  },
  {
    tag: "Comunidade",
    titulo: "Autores que fazem a diferença",
    texto:
      "Descubra quem está por trás das histórias e acompanhe o trabalho de cada escritor parceiro.",
    botao: "Explorar o catálogo",
    link: "/livros",
  },
];

const passosPublicacao = [
  {
    icone: <FaFileAlt />,
    titulo: "Envie seu original",
    texto:
      "Mande seu manuscrito e conte sua ideia. Analisamos o material e montamos um projeto sob medida.",
  },
  {
    icone: <FaSpellCheck />,
    titulo: "Revisão e diagramação",
    texto:
      "Revisão ortográfica e editorial, com diagramação cuidadosa para leitura confortável.",
  },
  {
    icone: <FaRocket />,
    titulo: "Lançamento",
    texto:
      "Seu livro vai para o catálogo, pronto para ser vendido e divulgado para novos leitores.",
  },
];

const totalSlides = slidesCarrossel.length;
const slidesExibidos = [...slidesCarrossel, slidesCarrossel[0]];
const intervaloCarrossel = 4000;

const calcularLimites = () => {
  const largura = window.innerWidth;
  if (largura >= 1600) return { livros: 5, autores: 4 };
  if (largura >= 1200) return { livros: 4, autores: 4 };
  if (largura >= 900) return { livros: 3, autores: 3 };
  if (largura >= 600) return { livros: 2, autores: 2 };
  return { livros: 1, autores: 1 };
};

const useLimitesPorTela = () => {
  const [limites, setLimites] = useState(calcularLimites);

  useEffect(() => {
    const aoRedimensionar = () => {
      const novos = calcularLimites();
      setLimites((atual) =>
        atual.livros === novos.livros && atual.autores === novos.autores
          ? atual
          : novos,
      );
    };
    window.addEventListener("resize", aoRedimensionar);
    return () => window.removeEventListener("resize", aoRedimensionar);
  }, []);

  return limites;
};

export default function Inicio() {
  const {
    autores,
    buscarAutores,
    carregando: carregandoAutores,
    meta: metaAutores,
  } = useAutores();

  const {
    Livros,
    BuscarLivros,
    carregando: carregandoLivros,
    meta,
  } = useLivros();

  const { livros: limiteLivros, autores: limiteAutores } = useLimitesPorTela();

  const [paginaAtualAutor, setPaginaAtualAutor] = useState(1);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [slideAtual, setSlideAtual] = useState(0);
  const [comTransicao, setComTransicao] = useState(true);
  const [carrosselPausado, setCarrosselPausado] = useState(false);

  useEffect(() => {
    if (carrosselPausado) return undefined;
    const intervalo = setInterval(() => {
      setComTransicao(true);
      setSlideAtual((prev) => (prev >= totalSlides ? prev : prev + 1));
    }, intervaloCarrossel);
    return () => clearInterval(intervalo);
  }, [carrosselPausado, slideAtual]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [limiteLivros]);

  useEffect(() => {
    setPaginaAtualAutor(1);
  }, [limiteAutores]);

  useEffect(() => {
    buscarAutores(paginaAtualAutor, limiteAutores);
  }, [buscarAutores, paginaAtualAutor, limiteAutores]);

  useEffect(() => {
    BuscarLivros(paginaAtual, limiteLivros);
  }, [BuscarLivros, paginaAtual, limiteLivros]);

  const aoTerminarTransicao = () => {
    if (slideAtual === totalSlides) {
      setComTransicao(false);
      setSlideAtual(0);
    }
  };

  const proximoSlide = () => {
    setComTransicao(true);
    setSlideAtual((prev) => (prev >= totalSlides ? prev : prev + 1));
  };

  const slideAnterior = () => {
    if (slideAtual === 0) {
      setComTransicao(false);
      setSlideAtual(totalSlides);
      setTimeout(() => {
        setComTransicao(true);
        setSlideAtual(totalSlides - 1);
      }, 30);
      return;
    }
    setComTransicao(true);
    setSlideAtual((prev) => prev - 1);
  };

  const irParaSlide = (index) => {
    setComTransicao(true);
    setSlideAtual(index);
  };

  const avancarPaginaAutor = () => {
    if (metaAutores && paginaAtualAutor < metaAutores.totalPages) {
      setPaginaAtualAutor((prev) => prev + 1);
    }
  };

  const voltarPaginaAutor = () => {
    if (paginaAtualAutor > 1) {
      setPaginaAtualAutor((prev) => prev - 1);
    }
  };

  const avancarPagina = () => {
    if (meta && paginaAtual < meta.totalPages) {
      setPaginaAtual((prev) => prev + 1);
    }
  };

  const voltarPagina = () => {
    if (paginaAtual > 1) {
      setPaginaAtual((prev) => prev - 1);
    }
  };

  return (
    <div>
      <section
        className={styles.carrossel}
        onMouseEnter={() => setCarrosselPausado(true)}
        onMouseLeave={() => setCarrosselPausado(false)}
        aria-label="Destaques"
      >
        <div
          className={styles.carrossel_trilho}
          style={{
            transform: `translateX(-${slideAtual * 100}%)`,
            transition: comTransicao ? "transform 0.7s ease" : "none",
          }}
          onTransitionEnd={aoTerminarTransicao}
        >
          {slidesExibidos.map((slide, index) => (
            <div
              key={`slide-${index}`}
              className={`${styles.carrossel_slide} ${styles[`slide_fundo_${(index % totalSlides) % 3}`]}`}
              aria-hidden={index % totalSlides !== slideAtual % totalSlides}
            >
              <div className={styles.slide_conteudo}>
                <span className={styles.slide_tag}>{slide.tag}</span>
                <h2 className={styles.slide_titulo}>{slide.titulo}</h2>
                <p className={styles.slide_texto}>{slide.texto}</p>
                <Link
                  to={slide.link}
                  className={styles.slide_botao}
                  tabIndex={
                    index % totalSlides === slideAtual % totalSlides ? 0 : -1
                  }
                >
                  {slide.botao}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={slideAnterior}
          className={`${styles.carrossel_seta} ${styles.carrossel_seta_esquerda}`}
          aria-label="Slide anterior"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={proximoSlide}
          className={`${styles.carrossel_seta} ${styles.carrossel_seta_direita}`}
          aria-label="Próximo slide"
        >
          <FaArrowRight />
        </button>

        <div className={styles.carrossel_indicadores}>
          {slidesCarrossel.map((_, index) => (
            <button
              key={`ponto-${index}`}
              onClick={() => irParaSlide(index)}
              className={`${styles.carrossel_ponto} ${
                index === slideAtual % totalSlides
                  ? styles.carrossel_ponto_ativo
                  : ""
              }`}
              aria-label={`Ir para o slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className={styles.bloco}>
        <div>
          <div className={styles.bloco_cabecalho}>
            <span className={styles.bloco_tag}>Passo a passo</span>
            <h2 className={styles.bloco_titulo}>Como funciona a publicação</h2>
            <p className={styles.bloco_subtitulo}>
              Do manuscrito ao livro nas mãos do leitor, você acompanha cada
              etapa de perto.
            </p>
          </div>

          <div className={styles.passos_grid}>
            {passosPublicacao.map((passo, index) => (
              <article key={passo.titulo} className={styles.passo_card}>
                <span className={styles.passo_numero}>{index + 1}</span>
                <div className={styles.passo_icone}>{passo.icone}</div>
                <h3>{passo.titulo}</h3>
                <p>{passo.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.subcontainer}>
          <section className={styles.secao_livros}>
            <div className={styles.container_header}>
              <div className={styles.catalogo}>
                <h2 className={styles.subtitulo_secao}>Livros Publicados</h2>
              </div>
              <div className={styles.header_acoes}>
                <div className={styles.nav_grupo}>
                  <button
                    onClick={voltarPagina}
                    disabled={paginaAtual === 1}
                    className={styles.btn_navegacao}
                  >
                    <FaArrowLeft />
                  </button>
                  <button
                    onClick={avancarPagina}
                    disabled={!meta || paginaAtual >= meta.totalPages}
                    className={styles.btn_navegacao}
                  >
                    <FaArrowRight />
                  </button>
                </div>
                <Link to="/loja" className={styles.btntchau}>
                  Ver todos
                </Link>
              </div>
            </div>

            <div className={styles.editorial_grid_livros}>
              {carregandoLivros ? (
                <p className={styles.loading_text}>Carregando destaques...</p>
              ) : !Livros || Livros.length === 0 ? (
                <p className={styles.empty_text}>
                  Nenhum livro em destaque no momento.
                </p>
              ) : (
                Livros.map((livro, index) => (
                  <Link
                    key={livro.id ? `livro-${livro.id}` : `livro-idx-${index}`}
                    to={`/livros/${livro.id}`}
                    className={styles.card_livro_editorial}
                  >
                    <div className={styles.capa_wrapper}>
                      {livro?.capa?.frente ? (
                        <img
                          src={livro.capa.frente}
                          alt={livro.titulo}
                          className={styles.img_capa}
                        />
                      ) : (
                        <div className={styles.sem_capa_placeholder}>
                          Sem Imagem
                        </div>
                      )}
                    </div>
                    <div className={styles.info_livro}>
                      <span className={styles.idioma_tag}>
                        {livro.idioma || "Português"}
                      </span>
                      <h3>{livro.titulo || "Sem título"}</h3>
                      <p className={styles.autorLivro}>
                        {livro.users_profile
                          ? `${livro.users_profile.nome} ${livro.users_profile.sobrenome || ""}`
                          : "Autor Independente"}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className={styles.secao_autores}>
            <div className={styles.container_headera}>
              <div className={styles.comunidade}>
                <h2 className={styles.subtitulo_secao}>Autores</h2>
              </div>
              <div className={styles.header_acoes}>
                <div className={styles.nav_grupo}>
                  <button
                    onClick={voltarPaginaAutor}
                    disabled={paginaAtualAutor === 1}
                    className={styles.btn_navegacao}
                  >
                    <FaArrowLeft />
                  </button>
                  <button
                    onClick={avancarPaginaAutor}
                    disabled={
                      !metaAutores || paginaAtualAutor >= metaAutores.totalPages
                    }
                    className={styles.btn_navegacao}
                  >
                    <FaArrowRight />
                  </button>
                </div>
                <Link to="/autores" className={styles.btntchau}>
                  Ver todos
                </Link>
              </div>
            </div>

            <div className={styles.editorial_grid_autores}>
              {carregandoAutores ? (
                <p className={styles.loading_text}>Carregando autores...</p>
              ) : !autores || autores.length === 0 ? (
                <p className={styles.empty_text}>Nenhum autor registrado.</p>
              ) : (
                autores.map((autor, index) => (
                  <Link
                    key={autor.id ? `autor-${autor.id}` : `autor-idx-${index}`}
                    to={`/autores/${autor.id}`}
                    className={styles.card_autor_editorial}
                  >
                    <div className={styles.avatar_container}>
                      {autor.imagem ? (
                        <img
                          src={autor.imagem}
                          alt={autor.nome}
                          className={styles.foto_perfil}
                        />
                      ) : (
                        <div className={styles.avatar_icon_placeholder}>
                          <FaUserCircle />
                        </div>
                      )}
                    </div>
                    <div className={styles.info_autor}>
                      <h3>{autor.nome || "Autor anônimo"}</h3>
                      <p className={styles.sinopse_autor}>
                        {autor.descricao
                          ? `${autor.descricao.substring(0, 75)}...`
                          : "Escritor independente parceiro da editora."}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      <section className={styles.cta_secao}>
        <div className={styles.cta_bloco}>
          <FaPenFancy className={styles.cta_icone} />
          <h2>Pronto para publicar o seu livro?</h2>
          <p>
            Conte com a Tropa Livresca para transformar o seu original em uma
            obra de excelência, do primeiro rascunho à prateleira.
          </p>
          <div className={styles.cta_acoes}>
            <Link to="/sobreautopublicacao" className={styles.cta_botao}>
              Quero publicar
            </Link>
            <Link to="/livros" className={styles.cta_botao_secundario}>
              Ver o catálogo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}