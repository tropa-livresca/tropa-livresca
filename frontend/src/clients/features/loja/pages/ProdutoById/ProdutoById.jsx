import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaUsers,
  FaLanguage,
  FaShoppingCart,
  FaTruck,
  FaUndo,
  FaShieldAlt,
} from "react-icons/fa";

import { useLivrosLoja } from "../../hooks/useLivrosLoja";
import { useBibliotecaPessoal } from "../../hooks/useBibliotecaPessoal";
import { useCarrinho } from "../../hooks/useCarrinho";
import { useAvaliacoes } from "../../hooks/useAvaliacoes";
import ResumoAvaliacao from "../../components/Avaliacao/ResumoAvaliacao";
import AbasLivro from "../../components/AbasLivro/AbasLivro";
import { useEndereco } from "../../../perfil/hooks/useEndereco";
import Carregando from "../../../../components/Carregando/Carregando";
import useAuth from "../../../../../common/hooks/useAuth";
import Modal from "../../../../../common/components/Modal/Modal";
import modalStyles from "../../../../../common/components/Modal/Modal.module.css";
import styles from "./ProdutoById.module.css";

export default function ProdutoById() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { signed, loading: authCarregando } = useAuth();

  const { autor, colaboradores, livro, buscarLivroById, carregando } =
    useLivrosLoja();

  const { BuscarEnderecoPrincipal } = useEndereco();
  const { adicionarItem } = useCarrinho();
  const { buscarMeusLivros } = useBibliotecaPessoal();

  const [formatoEscolhido, setFormato] = useState(null);
  const [qtd, setQtd] = useState(1);
  const [adicionado, setAdicionado] = useState(false);
  const [solicitandoLogin, setSolicitandoLogin] = useState(false);
  const [livroDigitalComprado, setLivroDigitalComprado] = useState(false);
  const [verificandoCompra, setVerificandoCompra] = useState(false);
  const [erroVerificacaoCompra, setErroVerificacaoCompra] = useState(false);

  const avaliacoes = useAvaliacoes();
  const { resumo, buscarResumo } = avaliacoes;

  useEffect(() => {
    buscarResumo(id);
  }, [id, buscarResumo]);

  const mapearIdioma = (idioma) => {
    if (!idioma) return "Não informado";

    const dicionario = {
      ingles: "Inglês",
      portugues: "Português",
      espanhol: "Espanhol",
    };

    return (
      dicionario[idioma.toLowerCase()] ||
      idioma.charAt(0).toUpperCase() + idioma.slice(1)
    );
  };

  useEffect(() => {
    if (id) {
      buscarLivroById(id);
    }
  }, [id, buscarLivroById]);

  useEffect(() => {
    if (signed && !authCarregando) {
      BuscarEnderecoPrincipal();
    }
  }, [signed, authCarregando, BuscarEnderecoPrincipal]);

  useEffect(() => {
    let ativo = true;

    setLivroDigitalComprado(false);
    setErroVerificacaoCompra(false);

    if (!signed || authCarregando || !id) {
      setVerificandoCompra(false);
      return () => {
        ativo = false;
      };
    }

    setVerificandoCompra(true);
    buscarMeusLivros(1, 1, "", "", "", "", "", id)
      .then((livrosComprados) => {
        if (!ativo) return;
        if (livrosComprados === null) {
          setErroVerificacaoCompra(true);
          return;
        }

        setLivroDigitalComprado(
          livrosComprados.some((item) => String(item.id) === String(id)),
        );
      })
      .finally(() => {
        if (ativo) setVerificandoCompra(false);
      });

    return () => {
      ativo = false;
    };
  }, [id, signed, authCarregando, buscarMeusLivros]);

  if (carregando) {
    return <Carregando mensagem="Carregando livro..." />;
  }

  if (!livro) {
    return <p className={styles.naoEncontrado}>Livro não encontrado.</p>;
  }

  const capaFrente = livro.capa?.frente;

  const formatarPreco = (valor) => {
    return Number(valor || 0)
      .toFixed(2)
      .replace(".", ",");
  };

  const temFisico = Number(livro.preco_fisico) > 0;
  const temDigital = Number(livro.preco_digital) > 0;

  const formato =
    formatoEscolhido || (temFisico ? "fisico" : temDigital ? "digital" : null);

  const precoAtual =
    formato === "fisico" ? livro.preco_fisico : livro.preco_digital;

  const escolherFormato = (novoFormato) => {
    setFormato(novoFormato);
    setAdicionado(false);
  };

  const handleAdicionarCarrinho = () => {
    if (authCarregando) return;

    if (!signed) {
      setSolicitandoLogin(true);
      return;
    }

    if (!formato) return;

    adicionarItem({
      id,
      titulo: livro.titulo,
      autor: autor?.nome || "Autor desconhecido",
      capa: capaFrente,
      preco: Number(precoAtual),
      tipo: formato,
      quantidade: formato === "fisico" ? qtd : 1,
    });

    setAdicionado(true);
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
            {livro.genero && (
              <span className={styles.genero}>{livro.genero}</span>
            )}

            <ResumoAvaliacao media={resumo.media} total={resumo.total} />

            {livro.idioma && (
              <div className={styles.tags}>
                <span>{mapearIdioma(livro.idioma)}</span>
              </div>
            )}
          </div>

          <div className={styles.informacoes}>
            {autor && (
              <Link
                to={`/autores/${autor.id}`}
                className={`${styles.informacaoAutor} ${styles.linkAutor}`}
              >
                {autor.imagem ? (
                  <img
                    className={styles.fotoAutor}
                    src={autor.imagem}
                    alt={`Foto de ${autor.nome}`}
                  />
                ) : (
                  <div className={styles.semFotoAutor}>Sem foto</div>
                )}

                <div className={styles.autorDados}>
                  <strong>Autor</strong>
                  <p>{autor.nome}</p>
                </div>
              </Link>
            )}

            <div className={styles.informacao}>
              <div className={styles.iconeInformacao}>
                <FaBookOpen />
              </div>

              <div>
                <strong>Publicado por</strong>
                <p>{autor?.nome || "Autor desconhecido"}</p>
              </div>
            </div>

            <div className={styles.informacao}>
              <div className={styles.iconeInformacao}>
                <FaCalendarAlt />
              </div>

              <div>
                <strong>Data de publicação</strong>
                <p className={styles.numero}>
                  {livro.data_de_publicacao
                    ? livro.data_de_publicacao.split("-").reverse().join("/")
                    : "Não informado"}
                </p>
              </div>
            </div>

            <div className={styles.informacao}>
              <div className={styles.iconeInformacao}>
                <FaUsers />
              </div>

              <div>
                <strong>Categoria</strong>
                <p>{livro.categoria || "Não informado"}</p>
              </div>
            </div>

            <div className={styles.informacao}>
              <div className={styles.iconeInformacao}>
                <FaLanguage />
              </div>

              <div>
                <strong>Idioma</strong>
                <p>{mapearIdioma(livro.idioma)}</p>
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
          {formato ? (
            <>
              <div className={styles.formatos}>
                {temFisico && (
                  <button
                    type="button"
                    className={`${styles.formato} ${formato === "fisico" ? styles.formatoAtivo : ""}`}
                    onClick={() => escolherFormato("fisico")}
                  >
                    <span>Físico</span>
                    <strong className={styles.numero}>
                      R$ {formatarPreco(livro.preco_fisico)}
                    </strong>
                  </button>
                )}

                {temDigital && (
                  <button
                    type="button"
                    className={`${styles.formato} ${formato === "digital" ? styles.formatoAtivo : ""}`}
                    onClick={() => escolherFormato("digital")}
                  >
                    <span>E-book</span>
                    <strong className={styles.numero}>
                      R$ {formatarPreco(livro.preco_digital)}
                    </strong>
                  </button>
                )}
              </div>

              <div className={styles.preco}>
                <span className={styles.numero}>
                  R$ {formatarPreco(precoAtual)}
                </span>
              </div>

              {formato === "fisico" && (
                <label className={styles.quantidade}>
                  Quantidade
                  <input
                    type="number"
                    className={styles.numero}
                    min="1"
                    max="99"
                    value={qtd}
                    onChange={(e) => {
                      setQtd(
                        Math.min(99, Math.max(1, Number(e.target.value) || 1)),
                      );
                      setAdicionado(false);
                    }}
                  />
                </label>
              )}

              {livroDigitalComprado && (
                <div className={styles.avisoLivroComprado} role="status">
                  <p>Você já comprou a versão digital deste livro.</p>
                  <Link to="/bibliotecapessoal">
                    Acessar biblioteca pessoal
                  </Link>
                </div>
              )}

              {erroVerificacaoCompra && (
                <p className={styles.avisoVerificacao} role="alert">
                  Não foi possível verificar se você já comprou este livro
                  digitalmente.
                </p>
              )}

              {livroDigitalComprado && formato === "digital" ? (
                <Link
                  to="/bibliotecapessoal"
                  className={styles.btnCarrinho}
                >
                  Acessar biblioteca pessoal
                </Link>
              ) : (
                <button
                  type="button"
                  className={styles.btnCarrinho}
                  onClick={handleAdicionarCarrinho}
                  disabled={
                    verificandoCompra ||
                    (erroVerificacaoCompra && formato === "digital")
                  }
                >
                  <FaShoppingCart />
                  {verificandoCompra
                    ? "Verificando compra..."
                    : "Adicionar ao carrinho"}
                </button>
              )}

              {adicionado && (
                <p className={styles.adicionado}>
                  Adicionado ao carrinho!{" "}
                  <Link to="/carrinho">Ver carrinho</Link>
                </p>
              )}
            </>
          ) : (
            <p className={styles.indisponivel}>
              Este livro ainda não está à venda.
            </p>
          )}

          <div className={styles.divisor}></div>

          <div className={styles.beneficio}>
            <FaTruck />
            <span>Envio imediato via e-mail</span>
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

      {solicitandoLogin && (
        <Modal
          title="Acesse sua conta"
          description="Entre ou crie uma conta para adicionar este livro ao carrinho."
          onClose={() => setSolicitandoLogin(false)}
        >
          <div className={modalStyles.acoes}>
            <button
              type="button"
              className={modalStyles.botao}
              onClick={() =>
                navigate("/auth/login", { state: { from: location } })
              }
            >
              Login
            </button>

            <button
              type="button"
              className={`${modalStyles.botao} ${modalStyles.botaoSecundario}`}
              onClick={() =>
                navigate("/auth/cadastro", { state: { from: location } })
              }
            >
              Cadastre-se
            </button>

            <button
              type="button"
              className={`${modalStyles.botao} ${modalStyles.botaoSecundario}`}
              onClick={() => setSolicitandoLogin(false)}
            >
              Agora não
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}
