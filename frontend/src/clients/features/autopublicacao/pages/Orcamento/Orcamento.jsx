import Input from "../../../../../common/components/Input/Input";
import styles from "./Orcamento.module.css";

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

  const lidarComProximaEtapa = () => {
    onChange({
      ...dados,
      valorLivroFisico: valoresFisico.final,
      valorLivroDigital: valoresDigital.final
    });
    irParaProximaEtapa();
  };

  return (
    <main>
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        <h1 className={styles.titulo}>Orçamento</h1>

        <div className={styles.card}>
          <legend>Especificações do Livro</legend>
          <label>
            Número de Páginas:
            <Input
              placeholder="Inserir número de páginas"
              type="number"
              className={styles.inputmodificado}
              min="1"
              value={dados.numeroPaginas || ""}
              handleOnChange={(e) => atualizarCampo("numeroPaginas", e.target.value)}
              disabled={isBloqueadoParaEdicao}
            />
          </label>
        </div>

        <div className={styles.card}>
          <legend>Preço do Livro Físico</legend>
          <p>Custo de Fabricação Mínimo (R$ <span className={styles.numero}>0,08</span> por página): R$ <span className={styles.numero}>{valoresFisico.minimo}</span></p>
          <label>
            Preço Base Desejado (R$):
            <Input
              type="text"
              placeholder="0,00"
              className={styles.inputmodificado}
              value={dados.valorLivroFisico || ""}
              handleOnChange={(e) => atualizarCampo("valorLivroFisico", e.target.value)}
              disabled={isBloqueadoParaEdicao}
            />
          </label>
          <div className={styles.div2}>
            <p>Comissão da Plataforma (+<span className={styles.numero}>20</span>%): R$ <span className={styles.numero}>{valoresFisico.comissao}</span></p>
            <strong className={styles.strong}>Valor Total de Venda: R$ <span className={styles.numero}>{valoresFisico.final}</span></strong>
          </div>
        </div>

        <div className={styles.card}>
          <legend>Preço do Livro Digital</legend>
          <p>Custo Digital Mínimo: R$ <span className={styles.numero}>{valoresDigital.minimo}</span></p>
          <label>
            Preço Base Desejado (R$):
            <Input
              type="text"
              placeholder="0,00"
              className={styles.inputmodificado}
              value={dados.valorLivroDigital || ""}
              handleOnChange={(e) => atualizarCampo("valorLivroDigital", e.target.value)}
              disabled={isBloqueadoParaEdicao}
            />
          </label>
          <div className={styles.div2}>
            <p>Comissão da Plataforma (+<span className={styles.numero}>20</span>%): R$ <span className={styles.numero}>{valoresDigital.comissao}</span></p>
            <strong className={styles.strong}>Valor Total de Venda: R$ <span className={styles.numero}>{valoresDigital.final}</span></strong>
          </div>
        </div>

        <div className={styles.posterior}>
          <button type="button" onClick={voltarEtapa} id={styles.btn}>Anterior</button>
          <button type="button" onClick={lidarComProximaEtapa} id={styles.btn2}>Posterior</button>
        </div>
      </form>
    </main>
  );
}
