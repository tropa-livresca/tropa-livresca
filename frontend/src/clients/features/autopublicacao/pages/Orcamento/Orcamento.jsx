import Input from "../../../../../common/components/Input/Input";

export default function Orcamento({ dados, onChange, irParaProximaEtapa, voltarEtapa }) {
  const numeroPaginas = Number(dados.numeroPaginas) || 100;

  const custoMinimoFisicoCentavos = numeroPaginas * 8;
  const custoMinimoDigitalCentavos = 599;

  const formatarMoeda = (centavos) => {
    const stringCentavos = String(centavos).padStart(3, "0");
    const reais = stringCentavos.slice(0, -2);
    const centavosFinais = stringCentavos.slice(-2);
    return `${reais},${centavosFinais}`;
  };

  const calcularEstruturaPrecoPorPrecoFinal = (valorDigitado, custoMinimoCentavos) => {
    const limpo = String(valorDigitado || "").replace(",", ".");
    const partes = limpo.split(".");
    
    const reais = Number(partes[0]) || 0;
    const centavos = Number(String(partes[1] || "").padEnd(2, "0").slice(0, 2)) || 0;
    const precoFinalDigitadoCentavos = (reais * 100) + centavos;

    const vendaTotalCentavos = Math.max(precoFinalDigitadoCentavos, custoMinimoCentavos);

    const subtotalCentavos = Math.round(vendaTotalCentavos / 1.20);
    const comissaoCentavos = vendaTotalCentavos - subtotalCentavos;

    return {
      minimo: formatarMoeda(custoMinimoCentavos),
      comissao: formatarMoeda(comissaoCentavos),
      final: formatarMoeda(vendaTotalCentavos)
    };
  };

  const atualizarCampo = (chave, valor) => {
    onChange({ ...dados, [chave]: valor });
  };

  const valoresFisico = calcularEstruturaPrecoPorPrecoFinal(dados.valorLivroFisico, custoMinimoFisicoCentavos);
  const valoresDigital = calcularEstruturaPrecoPorPrecoFinal(dados.valorLivroDigital, custoMinimoDigitalCentavos);

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
          <legend>Preço do Livro Físico</legend>
          <p>Custo de Fabricação Mínimo (R$ 0,08 por página): R$ {valoresFisico.minimo}</p>
          <label>
            Preço Final de Venda Desejado (R$):
            <Input
              type="text"
              placeholder="0,00"
              value={dados.valorLivroFisico || ""}
              handleOnChange={(e) => atualizarCampo("valorLivroFisico", e.target.value)}
            />
          </label>
          <div>
            <p>Comissão da Plataforma (20% inclusa): R$ {valoresFisico.comissao}</p>
            <strong>Valor Total de Venda: R$ {valoresFisico.final}</strong>
          </div>
        </fieldset>

        <fieldset>
          <legend>Preço do Livro Digital</legend>
          <p>Custo Digital Mínimo: R$ {valoresDigital.minimo}</p>
          <label>
            Preço Final de Venda Desejado (R$):
            <Input
              type="text"
              placeholder="0,00"
              value={dados.valorLivroDigital || ""}
              handleOnChange={(e) => atualizarCampo("valorLivroDigital", e.target.value)}
            />
          </label>
          <div>
            <p>Comissão da Plataforma (20% inclusa): R$ {valoresDigital.comissao}</p>
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
