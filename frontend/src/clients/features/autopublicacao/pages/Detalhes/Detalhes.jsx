import { useState } from "react";
import Select from "../../../../../common/components/Select/Select";
import Input from "../../../../../common/components/Input/Input";
import styles from "./Detalhes.module.css";
import { FiChevronDown } from "react-icons/fi";

export default function Detalhes({
  dados,
  onChange,
  irParaProximaEtapa,
  voltarEtapa,
  estadoAtualLivro,
}) {
  const deveBloquearCampos = estadoAtualLivro === "publicado";

  const listaIdiomas = [
    { id: "", label: "Selecione um idioma" },
    { id: "portugues", label: "PortuguÃªs" },
    { id: "ingles", label: "InglÃªs" },
    { id: "espanhol", label: "Espanhol" },
    {
      id: "bilingue-portugues-ingles",
      label: "BilÃ­ngue: PortuguÃªs e InglÃªs",
    },
    {
      id: "bilingue-portugues-espanhol",
      label: "BilÃ­ngue: PortuguÃªs e Espanhol",
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

  return (
    <main>
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        <h1 className={styles.titulo}>Detalhes</h1>

        <div className={styles.card}>
          <legend>Título e subtítulo</legend>
          {deveBloquearCampos && (
            <p>Título e subtítulo não podem ser alterados após publicação.</p>
          )}
          <label>
            Título:
            <Input
              placeholder="Inserir título"
              type="text"
              value={dados.titulo || ""}
              onChange={(e) => atualizarCampo("titulo", e.target.value)}
              handleOnChange={(e) => atualizarCampo("titulo", e.target.value)}
              disabled={deveBloquearCampos}
              className={styles.inputmodificado}
            />
          </label>
          <label>
            Subtítulo:
            <Input
              placeholder="Inserir subtítulo"
              type="text"
              value={dados.subtitulo || ""}
              onChange={(e) => atualizarCampo("subtitulo", e.target.value)}
              handleOnChange={(e) =>
                atualizarCampo("subtitulo", e.target.value)
              }
              disabled={deveBloquearCampos}
              className={styles.inputmodificado}
            />
          </label>
        </div>

        <div className={styles.card}>
          <legend>Edição</legend>
          <label>
            Número da edição:
            <Input
              placeholder="Inserir numero da edição"
              type="text"
              value={dados.numeroEdicao || ""}
              onChange={(e) => atualizarCampo("numeroEdicao", e.target.value)}
              handleOnChange={(e) =>
                atualizarCampo("numeroEdicao", e.target.value)
              }
              className={styles.inputmodificado}
            />
          </label>
        </div>

        <div className={styles.card}>
          <legend>Identificação do Autor no Livro</legend>
          {deveBloquearCampos && (
            <p>
              *Os daods do autor principal não podem ser alterados após a
              publicacação.
            </p>
          )}
          <label>
            Nome:
            <Input
              placeholder="Inserir nome do autor"
              type="text"
              value={dados.autor?.nome || ""}
              onChange={(e) => atualizarAutor("nome", e.target.value)}
              handleOnChange={(e) => atualizarAutor("nome", e.target.value)}
              disabled={deveBloquearCampos}
              className={styles.inputmodificado}
            />
          </label>
          <label>
            Sobrenome:
            <Input
              placeholder="Inserir sobrenome do autor"
              type="text"
              value={dados.autor?.sobrenome || ""}
              onChange={(e) => atualizarAutor("sobrenome", e.target.value)}
              handleOnChange={(e) =>
                atualizarAutor("sobrenome", e.target.value)
              }
              disabled={deveBloquearCampos}
              className={styles.inputmodificado}
            />
          </label>
        </div>

        <div className={styles.card}>
          <legend>Colaboradores do livro</legend>

          {listaColaboradores.map((colaborador, index) => (
            <div key={index} className={styles.selectContainer}>
              <h4>
                Colaborador <span className={styles.numero}>{index + 1}</span>
              </h4>

              <label>Função:</label>
              <Select
                className={styles.select}
                name={`funcao-${index}`}
                value={colaborador.funcao || ""}
                onChange={(e) =>
                  atualizarColaborador(index, "funcao", e.target.value || e)
                }
                handleOnChange={(e) =>
                  atualizarColaborador(index, "funcao", e.target.value || e)
                }
                options={funcaoOpcoes}
                onToggle={(aberto) =>
                  setFuncoesAbertas((prev) => ({ ...prev, [index]: aberto }))
                }
              />

              <FiChevronDown
                className={`${styles.arrow} ${
                  funcoesAbertas[index] ? styles.arrowAberta : ""
                }`}
              />

              <label>
                Nome:
                <Input
                  placeholder="Inserir nome do colaborador"
                  type="text"
                  value={colaborador.nome || ""}
                  onChange={(e) =>
                    atualizarColaborador(index, "nome", e.target.value)
                  }
                  className={styles.inputmodificado}
                />
              </label>

              <label>
                Sobrenome:
                <Input
                  placeholder="Inserir sobrenome do colaborador"
                  type="text"
                  value={colaborador.sobrenome || ""}
                  onChange={(e) =>
                    atualizarColaborador(index, "sobrenome", e.target.value)
                  }
                  className={styles.inputmodificado}
                />
              </label>

              <button
                type="button"
                onClick={() => removerColaborador(index)}
                className={styles.btn}
              >
                Remover este colaborador
              </button>
            </div>
          ))}

          <div className={styles.posterior}>
            <button
              type="button"
              onClick={adicionarColaborador}
              className={styles.btn2}
            >
              + Adicionar colaborador
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <legend>Idioma</legend>
          <label>
            Idioma:
            <Select
              name="idioma"
              value={dados.idioma || ""}
              onChange={(e) => atualizarCampo("idioma", e.target.value || e)}
              handleOnChange={(e) =>
                atualizarCampo("idioma", e.target.value || e)
              }
              options={listaIdiomas}
            />
          </label>
        </div>

        <div className={styles.card}>
          <legend>Descrição</legend>
          <label>
            Descrição do livro
            <textarea
              placeholder="Inserir descrição do livro"
              value={dados.descricao || ""}
              onChange={(e) => atualizarCampo("descricao", e.target.value)}
            />
          </label>
        </div>

        <div className={styles.card}>
          <legend>Direitos de Publicação e Uso de IA</legend>
          <Input
            id="direitoPublicacaoSim"
            type="radio"
            name="direitoPublicacao"
            checked={dados.direitoPublicacao === "sim"}
            onChange={() => atualizarCampo("direitoPublicacao", "sim")}
          />
          <label htmlFor="direitoPublicacaoSim">Sim</label>

          <Input
            id="direitoPublicacaoNao"
            type="radio"
            name="direitoPublicacao"
            checked={dados.direitoPublicacao === "nao"}
            onChange={() => atualizarCampo("direitoPublicacao", "nao")}
          />
          <label htmlFor="direitoPublicacaoNao">Não</label>
        </div>

        <div className={styles.card}>
          <legend>Restrições de Conteúdo</legend>
          <label>Há imagens explícitas?</label>
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
          />
          <label htmlFor="imagemExplicitaSim">Sim</label>

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
          />

          <label htmlFor="imagemExplicitaNao">Não</label>
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
            />
          </div>
        ) : imagemExplicita === "sim" ? (
          <div>
            <p>O livro será incluído automaticamente na categoria Adulto.</p>
          </div>
        ) : null}

        <div className={styles.card}>
          <legend>Tags</legend>
          <label>
            Palavras-chave (separadas por ponto e vírgula)
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
            />
          </label>
        </div>

        <div className={styles.posterior}>
          <button type="button" onClick={irParaProximaEtapa} id={styles.btn}>
            Posterior
          </button>
        </div>
      </form>
    </main>
  );
}
