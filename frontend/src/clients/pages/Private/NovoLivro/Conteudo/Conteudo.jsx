import Input from "../../../../components/form/Input/Input";

export default function Conteudo({ dados, onChange, irParaProximaEtapa, voltarEtapa }) {
  const atualizarCampo = (chave, valor) => {
    onChange({ ...dados, [chave]: valor });
  };

  const atualizarCapa = (parte, arquivos) => {
    onChange({
      ...dados,
      capa: {
        ...dados.capa,
        [parte]: arquivos
      }
    });
  };

  const obterPreview = (arquivos) => {
    if (arquivos && arquivos[0]) {
      return URL.createObjectURL(arquivos[0]);
    }
    return null;
  };

  const previewFrente = obterPreview(dados.capa?.frente);
  const previewVerso = obterPreview(dados.capa?.verso);
  const previewOrelhas = obterPreview(dados.capa?.orelhas);

  return (
    <main>
      <h1>Conteúdo</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend>Manuscrito</legend>
          <label>
            Subir arquivo do livro (Aceitamos formatos .pdf)
            <Input
              accept=".pdf"
              type="file"
              handleOnChange={(e) => atualizarCampo("manuscrito", e.target.files)}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Capa do Livro</legend>
          
          <div>
            <label>
              Frente da capa (.jpg, .png)
              <Input
                accept=".jpg,.jpeg,.png"
                type="file"
                handleOnChange={(e) => atualizarCapa("frente", e.target.files)}
              />
            </label>
            {previewFrente && (
              <div>
                <img src={previewFrente} alt="Preview da Frente" width="150" />
              </div>
            )}
          </div>

          <div>
            <label>
              Verso / Trás da capa (.jpg, .png)
              <Input
                accept=".jpg,.jpeg,.png"
                type="file"
                handleOnChange={(e) => atualizarCapa("verso", e.target.files)}
              />
            </label>
            {previewVerso && (
              <div>
                <img src={previewVerso} alt="Preview do Verso" width="150" />
              </div>
            )}
          </div>

          <div>
            <label>
              Orelhas da capa (.jpg, .png)
              <Input
                accept=".jpg,.jpeg,.png"
                type="file"
                handleOnChange={(e) => atualizarCapa("orelhas", e.target.files)}
              />
            </label>
            {previewOrelhas && (
              <div>
                <img src={previewOrelhas} alt="Preview das Orelhas" width="150" />
              </div>
            )}
          </div>
        </fieldset>

        <div>
          <button type="button" onClick={voltarEtapa}>Anterior</button>
          <button type="button" onClick={irParaProximaEtapa}>Posterior</button>
        </div>
      </form>
    </main>
  );
}
