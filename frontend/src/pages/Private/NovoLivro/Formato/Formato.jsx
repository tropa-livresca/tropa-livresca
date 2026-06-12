import { useEffect, useState } from "react";
import Input from "../../../../components/form/Input/Input";
/*
Checkbox de Livro físico e digital para a publicação
Escolha de formato de livro (Quadrado, Pocket, A5)
 */

export default function Formato() {

  const [tamanhoLivro, setTamanhoLivro] = useState("");
  const [tipoPublicacao, setTipoPublicacao] = useState("");

  return (
    <main>
      <form>
        <h1>Formato</h1>
        <fieldset>
          <legend>Tipo de Publicação</legend>
          <label>
            <Input
              type="radio"
              name="tipoPublicacao"
              value="físico"
              checked={tipoPublicacao === "fisico"}
              handleOnChange={(e) => setTipoPublicacao(e.target.value)}
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

        <fieldset>
          <legend>Formato do livro</legend>

          <label>
            <Input
              type="radio"
              name="tamanhoLivro"
              value="quadrado"
              checked={tamanhoLivro === "quadrado"}
              handleOnChange={(e) => setTamanhoLivro(e.target.value)}
            />
            Quadrado
          </label>


          <label>
            <Input
              type="radio"
              name="tamanhoLivro"
              value="pocket"
              checked={tamanhoLivro === "pocket"}
              handleOnChange={(e) => setTamanhoLivro(e.target.value)}
            />
            Pocket
          </label>


          <label>
            <Input
              type="radio"
              name="tamanhoLivro"
              value="A5"
              checked={tamanhoLivro === "A5"}
              handleOnChange={(e) => setTamanhoLivro(e.target.value)}
            />
            A5
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
