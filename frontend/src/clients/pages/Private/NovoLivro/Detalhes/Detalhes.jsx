import { useState } from "react";
import Select from "../../../../components/form/Select/Select";
import Input from "../../../../components/form/Input/Input";

export default function Detalhes({ dados, onChange, irParaProximaEtapa, voltarEtapa }) {
  const listaIdiomas = [
    { id: "", label: "Selecione um idioma" },
    { id: "portugues", label: "Português" },
    { id: "ingles", label: "Inglês" },
    { id: "espanhol", label: "Espanhol" },
    { id: "bilingue-portugues-ingles", label: "Bilíngue: Português e Inglês" },
    { id: "bilingue-portugues-espanhol", label: "Bilíngue: Português e Espanhol" },
    { id: "outro", label: "Outro" }
  ];

  const funcaoOpcoes = ["Selecione a função", "Coautor", "Ilustrador", "Revisor", "Tradutor", "Outro"];
  
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
      autor: { ...dados.autor, [chave]: valor }
    });
  };

  const atualizarColaborador = (index, chave, valor) => {
    const novosColaboradores = [...listaColaboradores];
    novosColaboradores[index] = {
      ...novosColaboradores[index],
      [chave]: valor
    };
    atualizarCampo("colaboradores", novosColaboradores);
  };

  const adicionarColaborador = () => {
    const novosColaboradores = [
      ...listaColaboradores,
      { funcao: "", nome: "", sobrenome: "" }
    ];
    atualizarCampo("colaboradores", novosColaboradores);
  };

  const removerColaborador = (indexParaRemover) => {
    const novosColaboradores = listaColaboradores.filter((_, index) => index !== indexParaRemover);
    atualizarCampo("colaboradores", novosColaboradores);
  };

  return (
    <main>
      <form onSubmit={(e) => e.preventDefault()}>
        <h1>Detalhes</h1>

        <fieldset>
          <legend>Título e subtítulo</legend>
          <label>
            *Título:
            <Input
              type="text"
              value={dados.titulo || ""}
              onChange={(e) => atualizarCampo("titulo", e.target.value)}
            />
          </label>
          <label>
            Subtítulo:
            <Input
              type="text"
              value={dados.subtitulo || ""}
              onChange={(e) => atualizarCampo("subtitulo", e.target.value)}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Edição</legend>
          <label>
            Número da edição:
            <Input
              type="text"
              value={dados.numeroEdicao || ""}
              onChange={(e) => atualizarCampo("numeroEdicao", e.target.value)}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Identificação do Autor no Livro</legend>
          <label>
            Nome:
            <Input
              type="text"
              value={dados.autor?.nome || ""}
              onChange={(e) => atualizarAutor("nome", e.target.value)}
            />
          </label>
          <label>
            Sobrenome:
            <Input
              type="text"
              value={dados.autor?.sobrenome || ""}
              onChange={(e) => atualizarAutor("sobrenome", e.target.value)}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Colaboradores do livro</legend>

          {listaColaboradores.map((colaborador, index) => (
            <div key={index}>
              <h4>Colaborador #{index + 1}</h4>

              <label>Função:</label>
              <Select
                name={`funcao-${index}`}
                value={colaborador.funcao || ""}
                onChange={(e) => atualizarColaborador(index, "funcao", e.target.value || e)}
                handleOnChange={(e) => atualizarColaborador(index, "funcao", e.target.value || e)}
                options={funcaoOpcoes}
              />

              <label>
                Nome:
                <Input
                  type="text"
                  value={colaborador.nome || ""}
                  onChange={(e) => atualizarColaborador(index, "nome", e.target.value)}
                />
              </label>

              <label>
                Sobrenome:
                <Input
                  type="text"
                  value={colaborador.sobrenome || ""}
                  onChange={(e) => atualizarColaborador(index, "sobrenome", e.target.value)}
                />
              </label>

              <button
                type="button"
                onClick={() => removerColaborador(index)}
              >
                Remover este colaborador
              </button>
            </div>
          ))}

          <button type="button" onClick={adicionarColaborador}>
            + Adicionar colaborador
          </button>
        </fieldset>

        <fieldset>
          <legend>Idioma</legend>
          <label>
            Idioma:
            <Select
              name="idioma"
              value={dados.idioma || ""}
              onChange={(e) => atualizarCampo("idioma", e.target.value || e)}
              handleOnChange={(e) => atualizarCampo("idioma", e.target.value || e)}
              options={listaIdiomas}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Descrição</legend>
          <label>
            Descrição do livro
            <textarea
              value={dados.descricao || ""}
              onChange={(e) => atualizarCampo("descricao", e.target.value)}
            />
          </label>
        </fieldset>

        <fieldset>
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
        </fieldset>

        <fieldset>
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
                categorias: ["Adulto"]
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
                categorias: []
              });
            }}
          />
          <label htmlFor="imagemExplicitaNao">Não</label>
        </fieldset>

        {imagemExplicita === "nao" ? (
          <fieldset>
            <legend>Classificação</legend>
            <label>Categoria do Livro</label>
            <Input
              type="text"
              value={Array.isArray(dados.categorias) ? dados.categorias.join(", ") : ""}
              onChange={(e) => atualizarCampo("categorias", e.target.value.split(", "))}
            />
          </fieldset>
        ) : imagemExplicita === "sim" ? (
          <div>
            <p>O livro será incluído automaticamente na categoria Adulto.</p>
          </div>
        ) : null}

        <fieldset>
          <legend>Tags</legend>
          <label>
            Palavras-chave (separadas por ponto e vírgula)
            <Input
              type="text"
              value={Array.isArray(dados.palavrasChave) ? dados.palavrasChave.join("; ") : ""}
              onChange={(e) => atualizarCampo("palavrasChave", e.target.value.split("; "))}
            />
          </label>
        </fieldset>

        <div>
          <button type="button" onClick={irParaProximaEtapa}>Posterior</button>
        </div>
      </form>
    </main>
  );
}
