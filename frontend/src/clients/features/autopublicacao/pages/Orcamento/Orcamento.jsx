import Input from "../../../../../common/components/Input/Input";

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
        <h1>OrÃ§amento</h1>

        <fieldset>
          <legend>EspecificaÃ§Ãµes do Livro</legend>
          <label>
            NÃºmero de PÃ¡ginas:
            <Input
              type="number"
              min="1"
              value={dados.numeroPaginas || ""}
              handleOnChange={(e) => atualizarCampo("numeroPaginas", e.target.value)}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>PreÃ§o do Livro FÃ­sico</legend>
          <p>Custo de FabricaÃ§Ã£o MÃ­nimo (R$ 0,08 por pÃ¡gina): R$ {valoresFisico.minimo}</p>
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
            <p>ComissÃ£o da Plataforma (20%): R$ {valoresFisico.comissao}</p>
            <strong>Valor Total de Venda: R$ {valoresFisico.final}</strong>
          </div>
        </fieldset>

        <fieldset>
          <legend>PreÃ§o do Livro Digital</legend>
          <p>Custo Digital MÃ­nimo: R$ {valoresDigital.minimo}</p>
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
            <p>ComissÃ£o da Plataforma (20%): R$ {valoresDigital.comissao}</p>
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

