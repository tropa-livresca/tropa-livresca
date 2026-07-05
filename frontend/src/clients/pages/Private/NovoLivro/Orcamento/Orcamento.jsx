import Input from "../../../../components/form/Input/Input";

export default function Orcamento({ dados, onChange, irParaProximaEtapa, voltarEtapa }) {
  const numeroPaginas = Number(dados.numeroPaginas) || 100;

  const precoMinimoFisicoCentavos = numeroPaginas * 8;
  const precoMinimoDigitalCentavos = 599;

  const formatarMoeda = (centavos) => {
    const stringCentavos = String(centavos).padStart(3, "0");
    const reais = stringCentavos.slice(0, -2);
    const centavosFinais = stringCentavos.slice(-2);
    return `${reais},${centavosFinais}`;
  };

  const calcularEstruturaPreco = (valorDigitado, minimoCentavos) => {
    const limpo = String(valorDigitado || "").replace(",", ".");
    const partes = limpo.split(".");
    
    const reais = Number(partes[0]) || 0;
    const centavos = Number(String(partes[1] || "").padEnd(2, "0").slice(0, 2)) || 0;
    const adicionalCentavos = (reais * 100) + centavos;

    const subtotalCentavos = minimoCentavos + adicionalCentavos;
    const comissaoCentavos = Math.round(subtotalCentavos * 0.20);
    const vendaTotalCentavos = subtotalCentavos + comissaoCentavos;

    return {
      minimo: formatarMoeda(minimoCentavos),
      comissao: formatarMoeda(comissaoCentavos),
      final: formatarMoeda(vendaTotalCentavos)
    };
  };

  const atualizarCampo = (chave, valor) => {
    onChange({ ...dados, [chave]: valor });
  };

  const valoresFisico = calcularEstruturaPreco(dados.valorLivroFisico, precoMinimoFisicoCentavos);
  const valoresDigital = calcularEstruturaPreco(dados.valorLivroDigital, precoMinimoDigitalCentavos);

  return (
    <main>
      <form onSubmit={(e) => e.preventDefault()}>
        <h1>Orçamento</h1>

        <fieldset>
          <legend>Especificações do Livro</legend>
          <label>
            Número de Páginas:
            <Input
              type="number"
              min="1"
              value={dados.numeroPaginas || ""}
              handleOnChange={(e) => atualizarCampo("numeroPaginas", e.target.value)}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Tipo de Impressão</legend>
          <label>
            <Input
              id="impressaoPretoBranco"
              type="radio"
              name="tipoFormatacao"
              value="pretoBranco"
              checked={dados.tipoFormatacao === "pretoBranco"}
              handleOnChange={(e) => atualizarCampo("tipoFormatacao", "pretoBranco")}
            />
            Preto e Branco
          </label>

          <label>
            <Input
              id="impressaoColorida"
              type="radio"
              name="tipoFormatacao"
              value="colorida"
              checked={dados.tipoFormatacao === "colorida"}
              handleOnChange={(e) => atualizarCampo("tipoFormatacao", "colorida")}
            />
            Colorida
          </label>
        </fieldset>

        <fieldset>
          <legend>Preço do Livro Físico</legend>
          <p>Custo de Fabricação Mínimo (R$ 0,08 por página): R$ {valoresFisico.minimo}</p>
          <label>
            Valor Adicional Desejado (R$):
            <Input
              type="text"
              placeholder="0,00"
              value={dados.valorLivroFisico || ""}
              handleOnChange={(e) => atualizarCampo("valorLivroFisico", e.target.value)}
            />
          </label>
          <div>
            <p>Comissão da Plataforma (20%): R$ {valoresFisico.comissao}</p>
            <strong>Valor Total de Venda: R$ {valoresFisico.final}</strong>
          </div>
        </fieldset>

        <fieldset>
          <legend>Preço do Livro Digital</legend>
          <p>Custo Digital Mínimo: R$ {valoresDigital.minimo}</p>
          <label>
            Valor Adicional Desejado (R$):
            <Input
              type="text"
              placeholder="0,00"
              value={dados.valorLivroDigital || ""}
              handleOnChange={(e) => atualizarCampo("valorLivroDigital", e.target.value)}
            />
          </label>
          <div>
            <p>Comissão da Plataforma (20%): R$ {valoresDigital.comissao}</p>
            <strong>Valor Total de Venda: R$ {valoresDigital.final}</strong>
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
