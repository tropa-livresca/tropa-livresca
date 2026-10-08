import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCreditCard, FiChevronDown } from "react-icons/fi";
import styles from "./PagamentoCartao.module.css";

export default function PagamentoCartao() {
  const [parcelamentoAberto, setParcelamentoAberto] = useState(false);

  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <Link to="/pagamento" className={styles.voltar}>
          <FiArrowLeft />
          Voltar para o pagamento
        </Link>
      </div>

      <section className={styles.formPagamento}>
        <div className={styles.formTitulo}>
          <div className={styles.icone}>
            <FiCreditCard />
          </div>

          <div>
            <strong>Pagamento com cartão</strong>
            <span>Preencha os dados do cartão abaixo.</span>
          </div>
        </div>

        <div className={styles.formulario}>
          <label>
            Número do cartão
            <input
              type="text"
              className={styles.numero2}
              placeholder="0000 0000 0000 0000"
            />
          </label>

          <label>
            Nome no cartão
            <input type="text" placeholder="Nome completo" />
          </label>

          <div className={styles.linhaCampos}>
            <label>
              Validade
              <input type="text" placeholder="MM/AA" />
            </label>

            <label>
              CVV
              <input
                type="text"
                className={styles.numero2}
                placeholder="123"
              />
            </label>
          </div>

          <div className={styles.parcelamento}>
            <span>Parcelamento</span>

            <div className={styles.opcoesParcelamento}>
              <button
                type="button"
                className={styles.opcaoSelecionada}
                onClick={() =>
                  setParcelamentoAberto(!parcelamentoAberto)
                }
              >
                <span>Selecione o parcelamento</span>

                <FiChevronDown
                  className={
                    parcelamentoAberto ? styles.setaAberta : styles.seta
                  }
                />
              </button>

              {parcelamentoAberto && (
                <div className={styles.listaParcelamento}>
                  <button type="button"><span className={styles.numero}>1</span>x sem juros</button>
                  <button type="button"><span className={styles.numero}>1</span>x sem juros</button>
                  <button type="button"><span className={styles.numero}>1</span>x sem juros</button>
                </div>
              )}
            </div>
          </div>


          <button type="button" className={styles.botao}>
            Continuar
          </button>

          
          <span className={styles.seguro}>
            Pagamento demonstrativo. Os dados não são processados por uma
            operadora de pagamento.
          </span>
        </div>
      </section>
    </main>
  );
}