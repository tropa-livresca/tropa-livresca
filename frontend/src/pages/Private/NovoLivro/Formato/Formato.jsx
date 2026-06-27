import { useEffect, useState } from "react";
import Input from "../../../../components/form/Input/Input";
/*
Checkbox de Livro físico e digital para a publicação
Escolha de formato de livro (Quadrado, Pocket, A5)
 */

export default function Formato({HandleCriarLivro}) {

  const [tipoPublicacao, setTipoPublicacao] = useState("");

  return (
    <main>
      <form onSubmit={(e) => {console.log(tipoPublicacao); HandleCriarLivro(e,tipoPublicacao)}}>
        <h1>Formato</h1>
        <fieldset>
          <legend>Tipo de Publicação</legend>
          <label>
            <Input
              type="radio"
              name="tipoPublicacao"
              value="físico"
              checked={tipoPublicacao === "fisico"}
              handleOnChange={(e) => {console.log(tipoPublicacao); setTipoPublicacao(e.target.value)}}
            />
            Livro físico
          </label>

          <label>
            <Input
              type="radio"
              name="tipoPublicacao"
              value="digital"
              checked={tipoPublicacao === "digital"}
              handleOnChange={(e) => setTipoPublicacao(e.target.value)}
            />
            Livro Digital (E-book)
          </label>

          <label>
            <Input
              type="radio"
              name="tipoPublicacao"
              value="ambos"
              checked={tipoPublicacao === "ambos"}
              handleOnChange={(e) => setTipoPublicacao(e.target.value)}
            />
            Ambas as formas de publicação
          </label>
        </fieldset>

        <div>
          <button>Anterior</button>
          <button>Posterior</button>
        </div>
        <button >Salvar</button>
      </form>
    </main>
  );
}
