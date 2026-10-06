import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import base from "../../../loja/pages/Compra/Compra.module.css";
import styles from "./MeusGanhos.module.css";
import { useGanhos } from "../../hooks/useGanhos";
import Carregando from "../../../../components/Carregando/Carregando";
import DescricaoTela from "../../../../components/DescricaoTela/DescricaoTela";

const formatarPreco = (valor) =>
  `R$ ${Number(valor || 0)
    .toFixed(2)
    .replace(".", ",")}`;

const formatarData = (data) =>
  data ? new Date(data).toLocaleDateString("pt-BR") : "";

export default function MeusGanhos() {
  const { ganhos, carregando, erro, buscarGanhos } = useGanhos();

  useEffect(() => {
    buscarGanhos();
  }, [buscarGanhos]);

  const extrato = ganhos?.extrato || [];
  const totalRecebido = extrato
    .filter((mov) => mov.tipo === "entrada")
    .reduce((acc, mov) => acc + Number(mov.valor), 0);

  return (
    <main>

       <DescricaoTela titulo = "Meus ganhos" descricao = "A cada livro seu vendido na loja, você recebe 30% do valor como
          direitos autorais." />

      <div className={base.container}>
        {carregando && !ganhos ? (
          <Carregando mensagem="Carregando seus ganhos..." />
        ) : erro ? (
          <p className={base.erro}>{erro}</p>
        ) : (
          <div className={styles.conteudo}>
            <div className={styles.cartoes}>
              <div className={`${styles.cartaoResumo} ${styles.destaque}`}>
                <span>Saldo disponível</span>
                <strong>{formatarPreco(ganhos?.saldo)}</strong>
              </div>
              <div className={styles.cartaoResumo}>
                <span>Total recebido</span>
                <strong>{formatarPreco(totalRecebido)}</strong>
              </div>
            </div>

            <section className={base.cartao}>
              <strong className={styles.ex}>Extrato</strong>

              {extrato.length === 0 ? (
                <p className={base.aviso}>
                  Você ainda não recebeu repasses. Quando um livro seu for
                  vendido e o repasse for autorizado, ele aparece aqui.{" "}
                  <Link to="/meuslivros">Ver meus livros</Link>
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
                          <strong className={styles.numero}>
                            {entrada
                              ? `Direitos autorais${mov.fk_vendas_id ? ` · Pedido #${mov.fk_vendas_id}` : ""}`
                              : "Saque"}
                          </strong>
                          <small>{formatarData(mov.data)}</small>
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
          </div>
        )}
      </div>
    </main>
  );
}
