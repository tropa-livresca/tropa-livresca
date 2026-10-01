import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiChevronRight } from "react-icons/fi";
import base from "../Compra/Compra.module.css";
import styles from "./MeusPedidos.module.css";
import { useCompra } from "../../hooks/useCompra";
import Carregando from "../../../../components/Carregando/Carregando";
import DescricaoTela from "../../../../components/DescricaoTela/DescricaoTela";

const formatarPreco = (valor) =>
  `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;

const formatarData = (data) =>
  data ? new Date(data).toLocaleDateString("pt-BR") : "";

const resumoItens = (itens = []) =>
  itens
    .map((item) => item.livros?.titulo)
    .filter(Boolean)
    .join(", ");

export default function MeusPedidos() {
  const { pedidos, buscarPedidos, carregando, erro } = useCompra();

  useEffect(() => {
    buscarPedidos();
  }, [buscarPedidos]);

  return (
    <main>

    <DescricaoTela titulo = "Meus pedidos" descricao = "Acompanhe suas compras na Tropa Livresca."/>
     
      <div className={base.container}>
        {carregando ? (
          <Carregando mensagem="Carregando pedidos..." />
        ) : erro ? (
          <p className={base.erro}>{erro}</p>
        ) : pedidos.length === 0 ? (
          <section className={base.vazio}>
            <p>Você ainda não fez nenhum pedido.</p>
            <Link to="/loja" className={base.voltar}>
              <FiArrowLeft /> Ir para a Loja
            </Link>
          </section>
        ) : (
          <ul className={styles.lista}>
            {pedidos.map((pedido) => {
              const pago = pedido.status_pagamento === "pago";

              return (
                <li key={pedido.id}>
                  <Link to={`/pedido/${pedido.id}`} className={styles.pedido}>
                    <div className={styles.info}>
                      <strong>Pedido <span className={styles.numero}>#{pedido.id}</span></strong>
                      <small>{formatarData(pedido.data)}</small>
                      <span className={styles.livros}>
                        {resumoItens(pedido.itens_venda)}
                      </span>
                    </div>

                    <div className={styles.status}>
                      <span
                        className={`${styles.etiqueta} ${pago ? styles.pago : styles.pendente}`}
                      >
                        {pago ? "Pago" : "Aguardando pagamento"}
                      </span>
                      {pedido.status_entrega !== "Não se aplica" && (
                        <small>Entrega: {pedido.status_entrega}</small>
                      )}
                    </div>

                    <strong className={styles.total}>
                      {formatarPreco(pedido.total)}
                    </strong>
                    <FiChevronRight className={styles.seta} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
