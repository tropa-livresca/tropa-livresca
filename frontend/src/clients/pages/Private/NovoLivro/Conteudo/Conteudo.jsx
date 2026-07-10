import { useEffect } from "react";
import Input from "../../../../components/form/Input/Input";

export default function Conteudo({ dados, onChange, irParaProximaEtapa, voltarEtapa }) {
  
  const atualizarCampo = (chave, e) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) {
      onChange({ ...dados, [chave]: arquivo });
    }
  };

  const atualizarCapa = (parte, e) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) {
      onChange({
        ...dados,
        capa: {
          ...(dados.capa || {}),
          [parte]: arquivo
        }
      });
    }
  };

  const obterPreview = (arquivo) => {
    if (arquivo && (arquivo instanceof File || arquivo instanceof Blob)) {
      return URL.createObjectURL(arquivo);
    }
    if (typeof arquivo === "string") {
      return arquivo;
    }
    return null;
  };

  const previewFrente = obterPreview(dados.capa?.frente);
  const previewVerso = obterPreview(dados.capa?.verso);
  const previewOrelhas = obterPreview(dados.capa?.orelhas);

  useEffect(() => {
    return () => {
      if (previewFrente) URL.revokeObjectURL(previewFrente);
      if (previewVerso) URL.revokeObjectURL(previewVerso);
      if (previewOrelhas) URL.revokeObjectURL(previewOrelhas);
    };
  }, [previewFrente, previewVerso, previewOrelhas]);

  return (
    <main>
      <h1>Conteúdo</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend>Manuscrito</legend>
          <label>
            Subir arquivo do livro (Aceitamos formatos .pdf)
            <input
              accept=".pdf"
              type="file"
              onChange={(e) => atualizarCampo("manuscrito", e)}
            />
          </label>
          {dados.manuscrito && <p style={{ color: "green" }}>✓ Manuscrito carregado</p>}
        </fieldset>

        <fieldset>
          <legend>Capa do Livro</legend>

          <div>
            <label>
              Frente da capa (.jpg, .png)
              <input
                accept=".jpg,.jpeg,.png"
                type="file"
                onChange={(e) => atualizarCapa("frente", e)}   
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
              <input
                accept=".jpg,.jpeg,.png"
                type="file"
                onChange={(e) => atualizarCapa("verso", e)}
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
              <input
                accept=".jpg,.jpeg,.png"
                type="file"
                onChange={(e) => atualizarCapa("orelhas", e)}
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
