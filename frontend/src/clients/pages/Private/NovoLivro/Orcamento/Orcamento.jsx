import { useState, useEffect } from "react";
import Input from "../../../../components/form/Input/Input";


/**
 * Tipo de publicação (checkbox)
 * Impressão (preto e branco ou colorida)
 * Valor livro físico (Valor mínimo, valor de comissão, valor final)
 * Valor livro digital (valor mínimo, valor de comissão, valor final)
 */

export default function Orcamento() {
  const [tipoPublicacao, setTipoPublicacao] = useState("");
  const [valorLivroFisico, setValorLivroFisico] = useState("");
  const [valorLivroDigital, setValorLivroDigital] = useState("");

  return (
    <main>
      <form>
        <h1>Orçamento</h1>
        <fieldset>
          <legend>Tipo de Publicação</legend>
          <label>
            <Input
              type="radio"
              name="tipoPublicacao"
              value="físico"
              checked={tipoPublicacao === "físico"}
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
          Valor do Livro Físico
          <label>
            <p>Valor Padrão</p>
            <Input
              type="text"
              value={valorLivroFisico}
              handleOnChange={(e) => setValorLivroFisico(e.target.value)}
            ></Input>
            <p>Valor total</p>
          </label>
        </fieldset>


        <fieldset>
          Valor do Livro Digital
          <label>
            <p>Valor Padrão</p>
            <Input
              type="text"
              value={valorLivroDigital}
              handleOnChange={(e) => setValorLivroDigital}
            ></Input>
            <p>Valor total</p>
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
