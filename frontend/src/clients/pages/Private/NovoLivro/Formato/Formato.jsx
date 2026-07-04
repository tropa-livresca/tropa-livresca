import Input from "../../../../components/form/Input/Input";

export default function Formato({ dados, onChange, irParaProximaEtapa, voltarEtapa }) {
  const atualizarCampo = (chave, valor) => {
    onChange({ ...dados, [chave]: valor });
  };

  return (
    <main>
      <form onSubmit={(e) => { e.preventDefault() }}>
        <h1>Formato</h1>

        <fieldset>
          <legend>Tipo de Publicação</legend>
          
          <Input
            id="publicacaoFisico"
            type="radio"
            name="tipoPublicacao"
            value="fisico"
            checked={dados.tipoPublicacao === "fisico"}
            handleOnChange={(e) => atualizarCampo("tipoPublicacao", e.target.value)}
          />
          <label htmlFor="publicacaoFisico">
            Livro físico
          </label>

          <Input
            id="publicacaoDigital"
            type="radio"
            name="tipoPublicacao"
            value="digital"
            checked={dados.tipoPublicacao === "digital"}
            handleOnChange={(e) => atualizarCampo("tipoPublicacao", e.target.value)}
          />
          <label htmlFor="publicacaoDigital">
            Livro Digital (E-book)
          </label>

          <Input
            id="publicacaoAmbos"
            type="radio"
            name="tipoPublicacao"
            value="ambos"
            checked={dados.tipoPublicacao === "ambos"}
            handleOnChange={(e) => atualizarCampo("tipoPublicacao", e.target.value)}
          />
          <label htmlFor="publicacaoAmbos">
            Ambas as formas de publicação
          </label>
        </fieldset>

        <div>
          <button type="button" onClick={voltarEtapa}>Anterior</button>
          <button type="button" onClick={irParaProximaEtapa}>Posterior</button>
        </div>
      </form>
    </main>
  );
}
