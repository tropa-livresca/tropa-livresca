import Input from "../../../../../common/components/Input/Input";

export default function Orcamento({ dados, onChange, irParaProximaEtapa, voltarEtapa, isBloqueadoParaEdicao }) {
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
    const valorFloat = parseFloat(limpo);

    let precoFinalDigitadoCentavos = 0;
    if (!isNaN(valorFloat)) {
      precoFinalDigitadoCentavos = Math.round(valorFloat * 100);
    }

    const subtotalCentavos = Math.max(precoFinalDigitadoCentavos, custoMinimoCentavos);
    const comissaoCentavos = Math.round(subtotalCentavos * 0.20);
    const vendaTotalCentavos = subtotalCentavos + comissaoCentavos;

    return {
      minimo: formatarMoeda(custoMinimoCentavos),
      comissao: formatarMoeda(comissaoCentavos),
      final: formatarMoeda(vendaTotalCentavos)
    };
  };

  const atualizarCampo = (chave, valor) => {
    const valorValidado = valor.replace(/[^0-9.,]/g, "");
    onChange({ ...dados, [chave]: valorValidado });
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
              disabled={isBloqueadoParaEdicao}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Preço do Livro Físico</legend>
          <p>Custo de Fabricação Mínimo (R$ 0,08 por página): R$ {valoresFisico.minimo}</p>
          <label>
            Preço Base Desejado (R$):
            <Input
              type="text"
              placeholder="0,00"
              value={dados.valorLivroFisico || ""}
              handleOnChange={(e) => atualizarCampo("valorLivroFisico", e.target.value)}
              disabled={isBloqueadoParaEdicao}
            />
          </label>
          <div>
            <p>Comissão da Plataforma (+20%): R$ {valoresFisico.comissao}</p>
            <strong>Valor Total de Venda: R$ {valoresFisico.final}</strong>
          </div>
        </fieldset>

        <fieldset>
          <legend>Preço do Livro Digital</legend>
          <p>Custo Digital Mínimo: R$ {valoresDigital.minimo}</p>
          <label>
            Preço Base Desejado (R$):
            <Input
              type="text"
              placeholder="0,00"
              value={dados.valorLivroDigital || ""}
              handleOnChange={(e) => atualizarCampo("valorLivroDigital", e.target.value)}
              disabled={isBloqueadoParaEdicao}
            />
          </label>
          <div>
            <p>Comissão da Plataforma (+20%): R$ {valoresDigital.comissao}</p>
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
