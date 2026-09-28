import Input from "../../../../../common/components/Input/Input";
import styles from "./Orcamento.module.css";
import { Link } from "react-router-dom";

export default function Orcamento({
  dados,
  onChange,
  irParaProximaEtapa,
  voltarEtapa,
}) {
  const orcamento = dados?.orcamento || {};
  const numeroPaginas = Number(orcamento.numeroPaginas) || 0;
  const custoMinimoFisicoCentavos = numeroPaginas * 8;
  const custoMinimoDigitalCentavos = 599;

  const formatarMoeda = (centavos) => {
    const stringCentavos = String(centavos).padStart(3, "0");
    const reais = stringCentavos.slice(0, -2);
    const centavosFinais = stringCentavos.slice(-2);
    return `${reais},${centavosFinais}`;
  };

  const calcularEstruturaPrecoPorPrecoFinal = (
    valorDigitado,
    custoMinimoCentavos,
  ) => {
    const limpo = String(valorDigitado || "").replace(",", ".");
    const valorFloat = parseFloat(limpo);
    let precoDigitadoCentavos = 0;
    if (!isNaN(valorFloat)) {
      precoDigitadoCentavos = Math.round(valorFloat * 100);
    }
    const subtotalCentavos = Math.max(
      precoDigitadoCentavos,
      custoMinimoCentavos,
    );
    const comissaoCentavos = Math.round(subtotalCentavos * 0.2);
    const vendaTotalCentavos = subtotalCentavos + comissaoCentavos;
    return {
      minimo: formatarMoeda(custoMinimoCentavos),
      comissao: formatarMoeda(comissaoCentavos),
      final: formatarMoeda(vendaTotalCentavos),
    };
  };

  const atualizarCampo = (chave, valor) => {
    const valorValidado = valor.replace(/[^0-9.,]/g, "");
    onChange({
      ...dados,
      orcamento: {
        ...orcamento,
        [chave]: valorValidado,
      },
    });
  };

  const validarPrecoMinimo = (chave) => {
    const valor = orcamento[chave];
    if (!valor) return;
    const valorNumerico = parseFloat(String(valor).replace(",", "."));
    const custoMinimo =
      chave === "valorLivroFisico"
        ? custoMinimoFisicoCentavos / 100
        : custoMinimoDigitalCentavos / 100;
    if (isNaN(valorNumerico) || valorNumerico < custoMinimo) {
      onChange({
        ...dados,
        orcamento: {
          ...orcamento,
          [chave]: formatarMoeda(
            chave === "valorLivroFisico"
              ? custoMinimoFisicoCentavos
              : custoMinimoDigitalCentavos,
          ),
        },
      });
    }
  };

  const valoresFisico = calcularEstruturaPrecoPorPrecoFinal(
    orcamento.valorLivroFisico,
    custoMinimoFisicoCentavos,
  );
  const valoresDigital = calcularEstruturaPrecoPorPrecoFinal(
    orcamento.valorLivroDigital,
    custoMinimoDigitalCentavos,
  );

  return (
    <main>
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        <h1 className={styles.titulo}>Orçamento</h1>

        <div className={styles.card}>
          <legend>Especificações do Livro</legend>
          <label>Número de Páginas: </label>
          <Input
            placeholder="Inserir número de páginas"
            type="number"
            className={styles.inputmodificado}
            min={1}
            value={orcamento.numeroPaginas || ""}
            readOnly
          />
        </div>

        <div className={styles.card}>
          <legend>Preço do Livro Físico</legend>
          <p>
            Custo de Fabricação Mínimo (R\${" "}
            <span className={styles.numero}>0,08</span> por página): R\$
            <span className={styles.numero}>{valoresFisico.minimo}</span>
          </p>
          <label>Preço Base Desejado (R\$): </label>
          <Input
            type="text"
            placeholder="0,00"
            className={styles.inputmodificado}
            value={orcamento.valorLivroFisico || ""}
            handleOnChange={(e) =>
              atualizarCampo("valorLivroFisico", e.target.value)
            }
            onBlur={() => validarPrecoMinimo("valorLivroFisico")}
          />
          <div className={styles.div2}>
            <p>
              Comissão da Plataforma (+{" "}
              <span className={styles.numero}>20</span>%): R\$
              <span className={styles.numero}>{valoresFisico.comissao}</span>
            </p>
            <strong className={styles.strong}>
              Valor Total de Venda: R\${" "}
              <span className={styles.numero}>{valoresFisico.final}</span>
            </strong>
          </div>
        </div>

        <div className={styles.card}>
          <legend>Preço do Livro Digital</legend>
          <p>
            Custo Digital Mínimo: R\${" "}
            <span className={styles.numero}>{valoresDigital.minimo}</span>
          </p>
          <label>Preço Base Desejado (R\$): </label>
          <Input
            type="text"
            placeholder="0,00"
            className={styles.inputmodificado}
            value={orcamento.valorLivroDigital || ""}
            handleOnChange={(e) =>
              atualizarCampo("valorLivroDigital", e.target.value)
            }
            onBlur={() => validarPrecoMinimo("valorLivroDigital")}
          />
          <div className={styles.div2}>
            <p>
              Comissão da Plataforma (+{" "}
              <span className={styles.numero}>20</span>%): R\$
              <span className={styles.numero}>{valoresDigital.comissao}</span>
            </p>
            <strong className={styles.strong}>
              Valor Total de Venda: R\${" "}
              <span className={styles.numero}>{valoresDigital.final}</span>
            </strong>
          </div>
        </div>

        <div className={styles.botao}>
          <Link to="/meuslivros" className={styles.btnmeu}>
            Voltar a Meus Livros
          </Link>
          <div className={styles.navegacao}>
            <button
              type="button"
              onClick={voltarEtapa}
              className={styles.btnmeu}
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={irParaProximaEtapa}
              className={styles.btn2meu}
            >
              Posterior
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
