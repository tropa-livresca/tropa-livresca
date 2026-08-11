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
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        <h1 className={styles.titulo}>Orçamento</h1>

         <div className={styles.card}>
          <legend>Especificações do Livro</legend>
          <label>
            Número de Páginas:</label>
            <Input
            placeholder="Inserir número de páginas"
              type="number"
              className={styles.inputmodificado}
              min="1"
              value={dados.numeroPaginas || ""}
              handleOnChange={(e) => atualizarCampo("numeroPaginas", e.target.value)}
              disabled={isBloqueadoParaEdicao}
            />
          
        </div>

        <div className={styles.card}>
          <legend>Preço do Livro Físico</legend>
          <p>Custo de Fabricação Mínimo (R$ <span className={styles.numero}>0,08</span> por página): R$ <span className={styles.numero}>{valoresFisico.minimo}</span></p>
          <label>
            Preço Final de Venda Desejado (R$):</label>
            <Input
              type="text"
              placeholder="0,00"
              className={styles.inputmodificado}
              value={dados.valorLivroFisico || ""}
              handleOnChange={(e) => atualizarCampo("valorLivroFisico", e.target.value)}
              disabled={isBloqueadoParaEdicao}
            />
          
          <div className={styles.div2}>
            <p>Comissão da Plataforma (<span className={styles.numero}>20</span>% inclusa): R$ <span className={styles.numero}>{valoresFisico.comissao}</span></p>
            <strong className={styles.strong}>Valor Total de Venda: R$ <span className={styles.numero}>{valoresFisico.final}</span></strong>
          </div>
        </div>

        <div className={styles.card}>
          <legend>Preço do Livro Digital</legend>
          <p>Custo Digital Mínimo: R$ <span className={styles.numero}>{valoresDigital.minimo}</span></p>
          <label>
            Preço Final de Venda Desejado (R$):</label>
            <Input
              type="text"
              placeholder="0,00"
              className={styles.inputmodificado}
              value={dados.valorLivroDigital || ""}
              handleOnChange={(e) => atualizarCampo("valorLivroDigital", e.target.value)}
              disabled={isBloqueadoParaEdicao}
            />
          
          <div className={styles.div2}>
            <p>Comissão da Plataforma (<span className={styles.numero}>20</span>% inclusa): R$ <span className={styles.numero}>{valoresDigital.comissao}</span></p>
            <strong className={styles.strong}>Valor Total de Venda: R$ <span className={styles.numero}>{valoresDigital.final}</span></strong>
          </div>
        </div>

        <div className={styles.posterior}>
          <button type="button" onClick={voltarEtapa} id={styles.btn}>Anterior</button>
          <button type="button" onClick={irParaProximaEtapa} id={styles.btn2}>Posterior</button>
        </div>
      </form>
    </main>
  );
}
