import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

import { useLivrosLoja } from "../../hooks/useLivrosLoja";
import { useCarrinho } from "../../hooks/useCarrinho";
import Carregando from "../../../../components/Carregando/Carregando";
import styles from "./ProdutoById.module.css";

export default function ProdutoById() {
  const { id } = useParams();

  const { autor, colaboradores, livro, buscarLivroById, carregando } =
    useLivrosLoja();

  const { adicionarItem } = useCarrinho();

  useEffect(() => {
    if (id) {
      buscarLivroById(id);
    }
  }, [id, buscarLivroById]);

  const [tipoSelecionado, setTipoSelecionado] = useState("Físico");

  const precoExibido =
    tipoSelecionado === "Físico" ? livro.preco_fisico : livro.preco_digital;

  if (carregando) {
    return <Carregando mensagem="Carregando livro..." />;
  }

  if (!livro) {
    return <p className={styles.naoEncontrado}>Livro não encontrado.</p>;
  }

  const capaFrente = livro.capa?.frente;

  const tipoProduto = livro.preco_fisico != null ? "Físico" : "Digital";

  const formatarPreco = (valor) => {
    return Number(valor || 0)
      .toFixed(2)
      .replace(".", ",");
  };

  const handleAdicionarCarrinho = () => {
    adicionarItem({
      id,
      titulo: livro.titulo,
      autor: autor?.nome || "Autor desconhecido",
      capa: capaFrente,
      preco: Number(precoExibido || 0),
      tipo: tipoProduto,
    });
  };

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.capaContainer}>
          {capaFrente ? (
            <img
              className={styles.foto}
              src={capaFrente}
              alt={`Capa do livro ${livro.titulo}`}
            />
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

              <div className={styles.avaliacao}>
                <span className={styles.estrelas}>★★★★★</span>

                <strong className={styles.numero}>4.8</strong>

                <span className={styles.numero}>(124 avaliações)</span>
              </div>

              <div className={styles.tags}>
                {livro.idioma && <span>{livro.idioma}</span>}
              </div>
            </div>

            {autor && (
              <div className={styles.autorCard}>
                {autor.imagem_perfil ? (
                  <img
                    className={styles.fotoAutor}
                    src={autor.imagem_perfil}
                    alt={`Foto de ${autor.nome}`}
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
          <div className={styles.tabs}>
            <button type="button" className={styles.tabAtiva}>
              Sinopse
            </button>

            <button type="button">Sobre o autor</button>

            <button type="button">
              Avaliações <span className={styles.numero}>(124)</span>
            </button>
          </div>

          <div className={styles.sinopse}>
            <p>{livro.descricao || "Sinopse não informada."}</p>
          </div>
        </div>

        <aside className={styles.compra}>
          <div className={styles.preco}>
            <span className={styles.numero}>
              R$ {formatarPreco(precoExibido)}
            </span>
          </div>

          <button
            type="button"
            className={styles.btnCarrinho}
            onClick={handleAdicionarCarrinho}
          >
            <FaShoppingCart />
            Adicionar ao carrinho
          </button>

          <div className={styles.divisor}></div>

          <div className={styles.beneficio}>
            <FaTruck />

            <span>
              {tipoProduto === "Físico"
                ? "Entrega para todo o Brasil"
                : "Envio imediato via e-mail"}
            </span>
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

      {colaboradores?.length > 0 && (
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
