import styles from "./Inicio.module.css";
import { Link } from "react-router-dom";
import { useAutores } from "../../../../hooks/useAutores";
import { useLivros } from "../../../../hooks/useLivros";
import { useEffect } from "react";
import { FaUserCircle, FaArrowRight } from "react-icons/fa";


export default function Inicio() {
  const { autores, buscarAutores, carregando: carregandoAutores } = useAutores();
  const { Livros, BuscarLivros, carregando: carregandoLivros } = useLivros();

  useEffect(() => {
    buscarAutores(1, 4, "");
    BuscarLivros(1, 4, "", "", "");
  }, [buscarAutores, BuscarLivros]);

  return (
    <div>
      <div className={styles.topo}>
      <section className={styles.hero_section}>
        <div className={styles.falecido}>
          <span className={styles.hero_tagline}>Autopublicação de Alto Nível</span>
          <h1>Publique seu livro com quem entende do mercado</h1>
          <p>
            A Tropa Livresca oferece projetos editoriais customizados, transformando 
            originais de autores independentes em obras físicas e digitais de excelência.
          </p>
          <div className={styles.hero_actions}>
            <Link to="/sobrenos" className={styles.btn_primary}>Publicar meu Projeto</Link>
            <Link to="/livros" className={styles.btn_secondary}>Conhecer o Catálogo</Link>
          </div>
        </div>
      </section>
      </div>
      <div class={styles.divisao}></div>
      <div className={styles.container}>
      <div className={styles.subcontainer}>
      <section className={styles.secao_livros}>
        <div className={styles.container_header}>
          <div className={styles.catalogo}>
            <span className={styles.subtitulo_secao}>Catálogo</span>
            <h2>Livros em Destaque</h2>
          </div>
          <div className={styles.descubra}>
          <Link to="/livros" className={styles.link_ver_todos}>
            Descubra mais livros <FaArrowRight />
          </Link>
          </div>
        </div>

        <div className={styles.editorial_grid_livros}>
          {carregandoLivros ? (
            <p className={styles.loading_text}>Carregando destaques...</p>
          ) : !Livros || Livros.length === 0 ? (
            <p className={styles.empty_text}>Nenhum livro em destaque no momento.</p>
          ) : (
            Livros.slice(0, 4).map((livro) => (
              <article key={livro.id} className={styles.card_livro_editorial}>
                <div className={styles.capa_wrapper}>
                  {livro?.capa?.frente ? (
                    <img src={livro.capa.frente} alt={livro.titulo} className={styles.img_capa} />
                  ) : (
                    <div className={styles.sem_capa_placeholder}>Sem Imagem</div>
                  )}
                </div>
                <div className={styles.info_livro}>
                  <span className={styles.idioma_tag}>{livro.idioma || "Português"}</span>
                  <h3>{livro.titulo || "Sem título"}</h3>
                  <p className={styles.autor_nome_livro}>
                    {livro.autor_nome ? `${livro.autor_nome} ${livro.autor_sobrenome || ""}` : "Autor Independente"}
                  </p>
                  <Link to={`/livros/detalhes/${livro.id}`} className={styles.link_detalhe_obra}>
                    Ver detalhes
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className={styles.secao_autores}>
        <div className={styles.container_header}>
          <div className={styles.comunidade}>
            <span className={styles.subtitulo_secao}>Comunidade</span>
            <h2>Nossos Autores</h2>
          </div>
          <div className={styles.descubra}>
          <Link to="/autores" className={styles.link_ver_todos}>
            Descubra mais autores <FaArrowRight />
          </Link>
          </div>
        </div>

        <div className={styles.editorial_grid_autores}>
          {carregandoAutores ? (
            <p className={styles.loading_text}>Carregando autores...</p>
          ) : !autores || autores.length === 0 ? (
            <p className={styles.empty_text}>Nenhum autor registrado.</p>
          ) : (
            autores.slice(0, 4).map((autor) => (
              <article key={autor.id} className={styles.card_autor_editorial}>
                <div className={styles.avatar_container}>
                  {autor.imagem ? (
                    <img src={autor.imagem} alt={autor.nome} className={styles.foto_perfil} />
                  ) : (
                    <div className={styles.avatar_icon_placeholder}>
                      <FaUserCircle />
                    </div>
                  )}
                </div>
                <div className={styles.info_autor}>
                  <h3>{autor.nome || "Autor anônimo"}</h3>
                  <p className={styles.sinopse_autor}>
                    {autor.descricao ? `${autor.descricao.substring(0, 75)}...` : "Escritor independente parceiro da editora."}
                  </p>
                  <Link to={`/autores/${autor.id}`} className={styles.link_perfil_autor}>
                    Ver perfil completo
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
      </div>
      </div>
    </div>
  );
}
