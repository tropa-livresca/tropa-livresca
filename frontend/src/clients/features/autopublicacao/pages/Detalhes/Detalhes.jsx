import { useState } from "react";
import Input from "../../../../../common/components/Input/Input";
import styles from "./Detalhes.module.css";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Detalhes({
  dados,
  onChange,
  irParaProximaEtapa,
  estadoAtualLivro,
}) {
  const deveBloquearCampos =
    estadoAtualLivro === "publicado" || estadoAtualLivro === "em_revisao";

  const listaIdiomas = [
    { id: "", label: "Selecione um idioma" },
    { id: "portugues", label: "Português" },
    { id: "ingles", label: "Inglês" },
    { id: "espanhol", label: "Espanhol" },
    {
      id: "bilingue-portugues-ingles",
      label: "Bilíngue: Português e Inglês",
    },
    {
      id: "bilingue-portugues-espanhol",
      label: "Bilíngue: Português e Espanhol",
    },
    { id: "outro", label: "Outro" },
  ];

  const funcaoOpcoes = [
    "Selecione a função",
    "Coautor",
    "Ilustrador",
    "Revisor",
    "Tradutor",
    "Outro",
  ];

  const [imagemExplicita, setImagemExplicita] = useState(() => {
    if (dados.imagensExplicitas === true) return "sim";
    if (dados.imagensExplicitas === false) return "nao";
    return "";
  });

  const listaColaboradores = dados.colaboradores || [];

  const atualizarCampo = (chave, valor) => {
    onChange({ ...dados, [chave]: valor });
  };

  const atualizarAutor = (chave, valor) => {
    onChange({
      ...dados,
      autor: { ...dados.autor, [chave]: valor },
    });
  };

  const atualizarColaborador = (index, chave, valor) => {
    const novosColaboradores = [...listaColaboradores];
    novosColaboradores[index] = {
      ...novosColaboradores[index],
      [chave]: valor,
    };
    atualizarCampo("colaboradores", novosColaboradores);
  };

  const adicionarColaborador = () => {
    const novosColaboradores = [
      ...listaColaboradores,
      { funcao: "", nome: "", sobrenome: "" },
    ];
    atualizarCampo("colaboradores", novosColaboradores);
  };

  const removerColaborador = (indexParaRemover) => {
    const novosColaboradores = listaColaboradores.filter(
      (_, index) => index !== indexParaRemover,
    );
    atualizarCampo("colaboradores", novosColaboradores);
  };

  const [funcoesAbertas, setFuncoesAbertas] = useState({});
  const [idiomaAberto, setIdiomaAberto] = useState(false);

  return (
    <main>
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        <h1 className={styles.titulo}>Detalhes</h1>

        <div className={styles.card}>
          <legend>Título e subtítulo</legend>
          {deveBloquearCampos && (
            <p>
              Título e subtítulo não podem ser alterados em revisão ou após
              publicação.
            </p>
          )}
          <label>Título:</label>
          <Input
            placeholder="Inserir título"
            type="text"
            value={dados.titulo || ""}
            onChange={(e) => atualizarCampo("titulo", e.target.value)}
            handleOnChange={(e) => atualizarCampo("titulo", e.target.value)}
            disabled={deveBloquearCampos}
            className={styles.inputmodificado}
          />

          <label>Subtítulo:</label>
          <Input
            placeholder="Inserir subtítulo"
            type="text"
            value={dados.subtitulo || ""}
            onChange={(e) => atualizarCampo("subtitulo", e.target.value)}
            handleOnChange={(e) => atualizarCampo("subtitulo", e.target.value)}
            disabled={deveBloquearCampos}
            className={styles.inputmodificado}
          />
        </div>

        <div className={styles.card}>
          <legend>Edição</legend>
          <label>Número da edição:</label>
          <Input
            placeholder="Inserir numero da edição"
            type="text"
            value={dados.numeroEdicao || ""}
            onChange={(e) => atualizarCampo("numeroEdicao", e.target.value)}
            handleOnChange={(e) =>
              atualizarCampo("numeroEdicao", e.target.value)
            }
            className={styles.inputmodificado}
            disabled={deveBloquearCampos}
          />
        </div>

        <div className={styles.card}>
          <legend>ISBN do livro</legend>
          {deveBloquearCampos && (
            <p>
              *O ISBN não pode ser alterado em revisão ou após a publicação.*
            </p>
          )}
          <label>ISBN: </label>
          <Input
            placeholder="Inserir numero da edição"
            type="text"
            value={dados.ISBN || ""}
            onChange={(e) => atualizarCampo("ISBN", e.target.value)}
            handleOnChange={(e) => atualizarCampo("ISBN", e.target.value)}
            className={styles.inputmodificado}
            disabled={deveBloquearCampos}
          />
        </div>

        <div className={styles.card}>
          <legend>Identificação do Autor no Livro</legend>
          {deveBloquearCampos && (
            <p>
              *Os dados do autor principal não podem ser alterados em revisão ou
              após a publicação.*
            </p>
          )}
          <label>Nome:</label>
          <Input
            placeholder="Inserir nome do autor"
            type="text"
            value={dados.autor?.nome || ""}
            onChange={(e) => atualizarAutor("nome", e.target.value)}
            handleOnChange={(e) => atualizarAutor("nome", e.target.value)}
            disabled={deveBloquearCampos}
            className={styles.inputmodificado}
          />

          <label>Sobrenome: </label>
          <Input
            placeholder="Inserir sobrenome do autor"
            type="text"
            value={dados.autor?.sobrenome || ""}
            onChange={(e) => atualizarAutor("sobrenome", e.target.value)}
            handleOnChange={(e) => atualizarAutor("sobrenome", e.target.value)}
            disabled={deveBloquearCampos}
            className={styles.inputmodificado}
          />
        </div>

        <div className={styles.card}>
          <legend>Colaboradores do livro</legend>

          {listaColaboradores.map((colaborador, index) => (
            <div key={index} className={styles.selectContainer}>
              <h4>
                Colaborador <span className={styles.numero}>{index + 1}</span>
              </h4>

              <label>Função:</label>
              <div className={styles.selectContainer}>
                <div
                  className={styles.select}
                  onClick={() =>
                    setFuncoesAbertas((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }))
                  }
                >
                  <span>{colaborador.funcao || "Selecione a função"}</span>

                  <FiChevronDown
                    className={`${styles.seta} ${
                      funcoesAbertas[index] ? styles.setaAberta : ""
                    }`}
                  />
                </div>

                {funcoesAbertas[index] && (
                  <div className={styles.opcoes}>
                    {funcaoOpcoes.map((opcao) => (
                      <div
                        key={opcao.value || opcao}
                        className={styles.opcao}
                        onClick={() => {
                          atualizarColaborador(
                            index,
                            "funcao",
                            opcao.value || opcao,
                          );

                          setFuncoesAbertas((prev) => ({
                            ...prev,
                            [index]: false,
                          }));
                        }}
                      >
                        {opcao.label || opcao}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label>Nome:</label>
              <Input
                placeholder="Inserir nome do colaborador"
                type="text"
                value={colaborador.nome || ""}
                onChange={(e) =>
                  atualizarColaborador(index, "nome", e.target.value)
                }
                className={styles.inputmodificado}
                disabled={deveBloquearCampos}
              />

              <label>Sobrenome:</label>
              <Input
                placeholder="Inserir sobrenome do colaborador"
                type="text"
                value={colaborador.sobrenome || ""}
                onChange={(e) =>
                  atualizarColaborador(index, "sobrenome", e.target.value)
                }
                className={styles.inputmodificado}
                disabled={deveBloquearCampos}
              />

              {!deveBloquearCampos && (
                <button
                  type="button"
                  onClick={() => removerColaborador(index)}
                  className={styles.btn}
                >
                  Remover este colaborador
                </button>
              )}
            </div>
          ))}

          <div className={styles.posterior}>
            {!deveBloquearCampos && (
              <button
                type="button"
                onClick={adicionarColaborador}
                className={styles.btn2}
              >
                + Adicionar colaborador
              </button>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <legend>Idioma</legend>
          <label>Idioma:</label>
          <div className={styles.selectContainer}>
            <div
              className={styles.select}
              onClick={() => setIdiomaAberto(!idiomaAberto)}
              disabled={deveBloquearCampos}
            >
              <span>
                {listaIdiomas.find((idioma) => idioma.id === dados.idioma)
                  ?.label || "Selecione um idioma"}
              </span>

              <FiChevronDown
                className={`${styles.seta} ${
                  idiomaAberto ? styles.setaAberta : ""
                }`}
              />
            </div>

            {idiomaAberto && (
              <div className={styles.opcoes}>
                {listaIdiomas.map((idioma) => (
                  <div
                    key={idioma.id}
                    className={styles.opcao}
                    onClick={() => {
                      atualizarCampo("idioma", idioma.id);
                      setIdiomaAberto(false);
                    }}
                  >
                    {idioma.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <legend>Descrição</legend>
          <label>Descrição do livro: </label>
          <textarea
            placeholder="Inserir descrição do livro"
            value={dados.descricao || ""}
            onChange={(e) => atualizarCampo("descricao", e.target.value)}
            disabled={deveBloquearCampos}
          />
        </div>

        <div className={styles.card}>
          <legend>Direitos de Publicação e Uso de IA</legend>

          <div className={styles.radioOpcao}>
            <Input
              id="direitoPublicacaoSim"
              type="radio"
              name="direitoPublicacao"
              checked={dados.direitoPublicacao === "sim"}
              onChange={() => atualizarCampo("direitoPublicacao", "sim")}
              disabled={deveBloquearCampos}
            />
            <label htmlFor="direitoPublicacaoSim">Sim</label>
          </div>

          <div className={styles.radioOpcao}>
            <Input
              id="direitoPublicacaoNao"
              type="radio"
              name="direitoPublicacao"
              checked={dados.direitoPublicacao === "nao"}
              onChange={() => atualizarCampo("direitoPublicacao", "nao")}
              disabled={deveBloquearCampos}
            />
            <label htmlFor="direitoPublicacaoNao">Não</label>
          </div>
        </div>

        <div className={styles.card}>
          <legend>Restrições de Conteúdo</legend>
          <label className={styles.labelTitulo}>Há imagens explícitas?</label>
          <div className={styles.radioOpcao}>
            <Input
              id="imagemExplicitaSim"
              type="radio"
              name="imagemExplicita"
              checked={imagemExplicita === "sim"}
              onChange={() => {
                setImagemExplicita("sim");
                onChange({
                  ...dados,
                  imagensExplicitas: true,
                  categorias: ["Adulto"],
                });
              }}
              handleOnChange={() => {
                setImagemExplicita("sim");
                onChange({
                  ...dados,
                  imagensExplicitas: true,
                  categorias: ["Adulto"],
                });
              }}
              disabled={deveBloquearCampos}
            />
            <label htmlFor="imagemExplicitaSim">Sim</label>
          </div>
          <div className={styles.radioOpcao}>
            <Input
              id="imagemExplicitaNao"
              type="radio"
              name="imagemExplicita"
              checked={imagemExplicita === "nao"}
              onChange={() => {
                setImagemExplicita("nao");
                onChange({
                  ...dados,
                  imagensExplicitas: false,
                  categorias: [],
                });
              }}
              handleOnChange={() => {
                setImagemExplicita("nao");
                onChange({
                  ...dados,
                  imagensExplicitas: false,
                  categorias: [],
                });
              }}
              disabled={deveBloquearCampos}
            />

            <label htmlFor="imagemExplicitaNao">Não</label>
          </div>
        </div>

        {imagemExplicita === "nao" ? (
          <div className={styles.card}>
            <legend>Classificação</legend>
            <label>Categoria do Livro</label>
            <Input
              placeholder="Inserir categoria do livro"
              type="text"
              value={
                Array.isArray(dados.categorias)
                  ? dados.categorias.join(", ")
                  : ""
              }
              onChange={(e) =>
                atualizarCampo("categorias", e.target.value.split(", "))
              }
              className={styles.inputmodificado}
              disabled={deveBloquearCampos}
            />
          </div>
        ) : imagemExplicita === "sim" ? (
          <div className={styles.avisoAdulto}>
            <p>O livro será incluído automaticamente na categoria Adulto.</p>
          </div>
        ) : null}

        <div className={styles.card}>
          <legend>Tags</legend>
          <label>Palavras-chave (separadas por ponto e vírgula) </label>
          <Input
            placeholder="Inserir palavras-chave"
            type="text"
            value={
              Array.isArray(dados.palavrasChave)
                ? dados.palavrasChave.join("; ")
                : ""
            }
            onChange={(e) =>
              atualizarCampo("palavrasChave", e.target.value.split("; "))
            }
            className={styles.inputmodificado}
            disabled={deveBloquearCampos}
          />
        </div>
        <div className={styles.botao}>
          <Link to="/meuslivros" className={styles.btnmeu}>
            Voltar a Meus Livros
          </Link>

          <button
            type="button"
            onClick={irParaProximaEtapa}
            className={styles.btnid}
          >
            Posterior
          </button>
        </div>
      </form>
    </main>
  );
}
