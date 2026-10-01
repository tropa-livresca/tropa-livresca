import { useLivros } from "../../../../hooks/useLivros";
import styles from "./LivroById.module.css";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Carregando from "../../../../components/Carregando/Carregando";
import { useAvaliacoes } from "../../../loja/hooks/useAvaliacoes";
import ResumoAvaliacao from "../../../loja/components/Avaliacao/ResumoAvaliacao";
import AbasLivro from "../../../loja/components/AbasLivro/AbasLivro";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaUsers,
  FaLanguage,
  FaShoppingCart,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaFileAlt,
  FaRobot,
} from "react-icons/fa";

export default function LivroById() {
  const { id } = useParams();
  const avaliacoes = useAvaliacoes();
  const { resumo, buscarResumo } = avaliacoes;

  useEffect(() => {
    buscarResumo(id);
  }, [id, buscarResumo]);

  const { autor, colaboradores, livro, BuscarDetalhesLivro, carregando } =
    useLivros();

  useEffect(() => {
    if (id) {
      BuscarDetalhesLivro(id);
    }
  }, [id, BuscarDetalhesLivro]);

  if (carregando) {
    return <Carregando mensagem="Carregando livro..." />;
  }

  if (!livro) {
    return <p className={styles.naoEncontrado}>Livro não encontrado.</p>;
  }

  const capaFrente = livro?.capa?.frente;

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.capaContainer}>
          {capaFrente ? (
            <img className={styles.foto} src={capaFrente} alt={livro.titulo} />
          ) : (
            <div className={styles.semfoto}>Sem foto</div>
          )}
        </div>

        <div className={styles.heroinfo}>
          <h1 className={styles.titulo}>{livro.titulo}</h1>

          {livro.subtitulo && (
            <h2 className={styles.subtitulo}>{livro.subtitulo}</h2>
          )}

          <div className={styles.infoTopo}>
            <div className={styles.infoEsquerda}>
              {livro.genero && (
                <span className={styles.genero}>{livro.genero}</span>
              )}

              <ResumoAvaliacao media={resumo.media} total={resumo.total} />

              <div className={styles.tags}>
                {livro.idioma && <span>{livro.idioma}</span>}
                {livro.categoria && <span>{livro.categoria}</span>}
              </div>
            </div>

            {autor && (
              <div className={styles.autorCard}>
                {autor.imagem_perfil ? (
                  <img
                    className={styles.fotoAutor}
                    src={autor.imagem_perfil}
                    alt={autor.nome}
                  />
                ) : (
                  <div className={styles.semFotoAutor}>Sem foto</div>
                )}

                <div className={styles.autorDados}>
                  <span>Autor</span>

                  <h3>{autor.nome}</h3>

                  <Link to={`/autores/${autor.id}`} className={styles.btnAutor}>
                    Ver perfil
                  </Link>
                </div>
              </div>
            )}
          </div>

          <span className={styles.linha}></span>

          <div className={styles.informacoes}>
            <div className={styles.informacao}>
              <FaBookOpen />

              <div className={styles.oi}>
                <strong>Publicado por</strong>

                <p>{autor?.nome || "Autor desconhecido"}</p>
              </div>
            </div>

            <div className={styles.informacao}>
              <FaCalendarAlt />

              <div>
                <strong>Data de publicação</strong>

                <p className={styles.numero}>
                  {livro.data_de_publicacao || "Não informado"}
                </p>
              </div>
            </div>

            <div className={styles.informacao}>
              <FaUsers />

              <div>
                <strong>Público-alvo</strong>

                <p>{livro.publico_alvo || "Não informado"}</p>
              </div>
            </div>

            <div className={styles.informacao}>
              <FaFileAlt />

              <div>
                <strong>Número da edição</strong>

                <p className={styles.numero}>
                  {livro.numero_edicao || "Não informado"}
                </p>
              </div>
            </div>

            <div className={styles.informacao}>
              <FaRobot />

              <div>
                <strong>Feito com IA?</strong>

                <p>{livro.conteudo_por_IA ? "Sim" : "Não"}</p>
              </div>
            </div>

            <div className={styles.informacao}>
              <FaLanguage />

              <div className={styles.oi}>
                <strong>Idioma</strong>

                <p>{livro.idioma || "Não informado"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.conteudo}>
        <div className={styles.conteudoPrincipal}>
          <AbasLivro
            livroId={id}
            descricao={livro.descricao}
            autor={autor}
            avaliacoes={avaliacoes}
          />
        </div>

        <aside className={styles.compra}>
          <p className={styles.chamadaLoja}>
            Veja os formatos e preços disponíveis na loja.
          </p>

          <Link to={`/loja/livro/${id}`} className={styles.btnCarrinho}>
            <FaShoppingCart />
            Comprar na loja
          </Link>

          <div className={styles.divisor}></div>

          <div className={styles.beneficio}>
            <FaTruck />

            <span>Entrega para todo o Brasil</span>
          </div>

          <div className={styles.beneficio}>
            <FaShieldAlt />

            <span>
              Compra <span className={styles.numero}>100%</span> segura
            </span>
          </div>

          <div className={styles.beneficio}>
            <FaUndo />

            <span>
              Troca e devolução em até <span className={styles.numero}>7</span>{" "}
              dias
            </span>
          </div>
        </aside>
      </section>

      {colaboradores && colaboradores.length > 0 && (
        <section className={styles.secaoColaboradores}>
          <h2 className={styles.tituloSecao}>Relação dos colaboradores</h2>

          <ul className={styles.listaColaboradores}>
            {colaboradores.map((colaborador, index) => (
              <li
                className={styles.colaborador}
                key={`${colaborador.nome}-${index}`}
              >
                <span className={styles.nomeColaborador}>
                  {colaborador.nome} {colaborador.sobrenome}
                </span>

                <span className={styles.funcaoColaborador}>
                  {colaborador.funcao}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
