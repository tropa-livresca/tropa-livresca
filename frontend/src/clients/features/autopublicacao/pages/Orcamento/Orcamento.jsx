import Input from "../../../../../common/components/Input/Input";
import styles from "./Orcamento.module.css";
import { Link } from "react-router-dom";

const CUSTO_POR_PAGINA_CENTAVOS = 8;
const CUSTO_MINIMO_DIGITAL_CENTAVOS = 599;
const PORCENTAGEM_PLATAFORMA = 70;

export default function Orcamento({
  dados,
  onChange,
  irParaProximaEtapa,
  numeroPaginas,
  voltarEtapa,
}) {
  const orcamento = dados || {};

  numeroPaginas = Math.max(0, Number(numeroPaginas) || 0);

  const custoMinimoFisico = numeroPaginas * CUSTO_POR_PAGINA_CENTAVOS;

  const custoMinimoDigital = CUSTO_MINIMO_DIGITAL_CENTAVOS;

  const converterParaCentavos = (valor) => {
    const limpo = String(valor ?? "")
      .replace(",", ".")
      .trim();

    if (!limpo || !/^\d+(\.\d{0,2})?$/.test(limpo)) {
      return 0;
    }

    return Math.round(Number(limpo) * 100);
  };

  const formatarMoeda = (centavos) =>
    (centavos / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const calcularValores = (precoTotal, custoMinimo) => {
    const precoTotalCentavos = converterParaCentavos(precoTotal);

    const valorDesejadoAutor = Math.max(0, precoTotalCentavos - custoMinimo);

    const valorPlataforma = Math.round(
      (precoTotalCentavos * PORCENTAGEM_PLATAFORMA) / 100,
    );

    const valorAutor = precoTotalCentavos - valorPlataforma;

    return {
      custoMinimo: formatarMoeda(custoMinimo),
      valorDesejadoAutor: formatarMoeda(valorDesejadoAutor),
      precoTotal: formatarMoeda(precoTotalCentavos),
      valorPlataforma: formatarMoeda(valorPlataforma),
      valorAutor: formatarMoeda(valorAutor),
    };
  };

  const atualizarPrecoTotal = (chave, valor, custoMinimo) => {
    let valorValidado = valor.replace(/[^0-9.,]/g, "");

    const indiceSeparador = valorValidado.search(/[.,]/);

    if (indiceSeparador !== -1) {
      const parteInteira = valorValidado
        .slice(0, indiceSeparador)
        .replace(/[.,]/g, "");

      const parteDecimal = valorValidado
        .slice(indiceSeparador + 1)
        .replace(/[.,]/g, "")
        .slice(0, 2);

      valorValidado = `${parteInteira},${parteDecimal}`;
    }

    const valorDesejadoCentavos = converterParaCentavos(valorValidado);

    const precoTotalCentavos = custoMinimo + valorDesejadoCentavos;

    onChange({
      ...orcamento,
      [chave]: formatarMoeda(precoTotalCentavos),
    });
  };

  const valoresFisico = calcularValores(
    orcamento.valorLivroFisico,
    custoMinimoFisico,
  );

  const valoresDigital = calcularValores(
    orcamento.valorLivroDigital,
    custoMinimoDigital,
  );

  const renderizarResumo = (valores) => (
    <div className={styles.div2}>
      <p>
        Custo mínimo: R${" "}
        <span className={styles.numero}>{valores.custoMinimo}</span>
      </p>

      <p>
        Valor desejado pelo autor: R${" "}
        <span className={styles.numero}>{valores.valorDesejadoAutor}</span>
      </p>

      <p>
        Valor recebido pela plataforma (70%): R${" "}
        <span className={styles.numero}>{valores.valorPlataforma}</span>
      </p>

      <p>
        Valor destinado ao autor (30%): R${" "}
        <span className={styles.numero}>{valores.valorAutor}</span>
      </p>

      <strong className={styles.strong}>
        Preço total de venda: R${" "}
        <span className={styles.numero}>{valores.precoTotal}</span>
      </strong>
    </div>
  );

  return (
    <main>
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        <h1 className={styles.titulo}>Orçamento</h1>

        <div className={styles.card}>
          <legend>Preço do Livro Físico</legend>

          <p>
            Custo mínimo de fabricação (R$ 0,08 por página): R${" "}
            <span className={styles.numero}>
              {formatarMoeda(custoMinimoFisico)}
            </span>
          </p>

          <label htmlFor="valorLivroFisico">
            Valor desejado pelo autor (R$):
          </label>

          <Input
            id="valorLivroFisico"
            type="text"
            placeholder="0,00"
            className={styles.inputmodificado}
            value={valoresFisico.valorDesejadoAutor}
            handleOnChange={(e) =>
              atualizarPrecoTotal(
                "valorLivroFisico",
                e.target.value,
                custoMinimoFisico,
              )
            }
          />

          {renderizarResumo(valoresFisico)}
        </div>

        <div className={styles.card}>
          <legend>Preço do Livro Digital</legend>

          <p>
            Custo mínimo digital: R${" "}
            <span className={styles.numero}>
              {formatarMoeda(custoMinimoDigital)}
            </span>
          </p>

          <label htmlFor="valorLivroDigital">
            Valor desejado pelo autor (R$):
          </label>

          <Input
            id="valorLivroDigital"
            type="text"
            placeholder="0,00"
            className={styles.inputmodificado}
            value={valoresDigital.valorDesejadoAutor}
            handleOnChange={(e) =>
              atualizarPrecoTotal(
                "valorLivroDigital",
                e.target.value,
                custoMinimoDigital,
              )
            }
          />

          {renderizarResumo(valoresDigital)}
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
