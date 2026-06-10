import { useState, useEffect } from "react";
import Input from "../../../../components/form/Input/Input";
/**
 * Manuscrito (upload)
 * Capa do Livro (Dividir em frente, trás e orelhas)
 * Pré-visualização da capa
 */

const [conteudo, setConteudo] = useState([]);
const [capa, setCapa] = useState("");

export default function Conteudo() {
  return (
    <main>
      <h1>Contéudo</h1>
      <form>
        <fieldset>
          <label>
            Subir arquivo do livro (Aceitamos formatos .pdf)
            <Input
              type="file"
              value={conteudo}
              handleOnChange={(e) => setConteudo(e.target.value)}
            />
          </label>
        </fieldset>

        <fieldset>
          <label>
            <Input
              type="file"
              value={capa}
              handleOnChange={(e) => { setCapa(e.target.value) }}
            />
          </label>
        </fieldset>

        <div>
          <button>Anterior</button>
          <button>Posterior</button>
        </div>
        <button>Salvar</button>
      </form>
    </main>
  );
}
