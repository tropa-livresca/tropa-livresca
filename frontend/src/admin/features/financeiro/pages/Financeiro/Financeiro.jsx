import { useEffect } from "react";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import styles from "./Financeiro.module.css";
import { useFinanceiro } from "../../hooks/useFinanceiro";
import Carregando from "../../../../components/Carregando/Carregando";

const formatarPreco = (valor) =>
  `R$ ${Number(valor || 0)
    .toFixed(2)
    .replace(".", ",")}`;

const formatarData = (data) =>
  data ? new Date(data).toLocaleDateString("pt-BR") : "";

export default function Financeiro() {
  const { dados, carregando, erro, buscarFinanceiro } = useFinanceiro();

  useEffect(() => {
    buscarFinanceiro();
  }, [buscarFinanceiro]);

  const extrato = dados?.extrato || [];

  return (
    <main className={styles.mainContainer}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Financeiro</h1>
        <p>
          Vendas da loja e repasses de direitos autorais. Cada venda é dividida
          em 30% para o autor e 70% para a plataforma.
        </p>
      </div>

      <div className={styles.container}>
        {carregando && !dados ? (
          <Carregando mensagem="Carregando financeiro..." />
        ) : erro ? (
          <p className={styles.erro}>{erro}</p>
        ) : (
          <>
            <div className={styles.cartoes}>
              <div className={styles.cartaoResumo}>
                <span>Total vendido</span>
                <strong>{formatarPreco(dados.totalVendas)}</strong>
                <small>Livros vendidos com repasse autorizado</small>
              </div>
              <div className={styles.cartaoResumo}>
                <span>Repassado aos autores</span>
                <strong>{formatarPreco(dados.totalRepassado)}</strong>
                <small>30% de cada venda</small>
              </div>
              <div className={`${styles.cartaoResumo} ${styles.destaque}`}>
                <span>Saldo da plataforma</span>
                <strong>{formatarPreco(dados.saldoTotalCaixa)}</strong>
                <small>70% de cada venda</small>
              </div>
            </div>

            <section className={styles.cartao}>
              <h2 className={styles.subtitulo}>Extrato da plataforma</h2>

              {extrato.length === 0 ? (
                <p className={styles.vazio}>
                  Nenhuma movimentação ainda. Autorize um repasse em
                  E-commerce → Gerenciar Pedidos.
                </p>
              ) : (
                <ul className={styles.extrato}>
                  {extrato.map((mov) => {
                    const entrada = mov.tipo === "entrada";
                    return (
                      <li key={mov.id} className={styles.movimentacao}>
                        <span
                          className={`${styles.icone} ${entrada ? styles.iconeEntrada : styles.iconeSaida}`}
                        >
                          {entrada ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                        </span>
                        <div className={styles.descricao}>
                          <strong>
                            {entrada ? "Venda" : "Repasse ao autor"}
                            {mov.fk_vendas_id ? ` · Pedido #${mov.fk_vendas_id}` : ""}
                          </strong>
                          <small>
                            {formatarData(mov.data)} · {mov.descricao}
                          </small>
                        </div>
                        <strong
                          className={entrada ? styles.valorEntrada : styles.valorSaida}
                        >
                          {entrada ? "+" : "−"} {formatarPreco(mov.valor)}
                        </strong>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
