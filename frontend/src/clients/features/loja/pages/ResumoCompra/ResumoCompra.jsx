import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import base from "../Compra/Compra.module.css";
import styles from "./ResumoCompra.module.css";
import { useCompra } from "../../hooks/useCompra";
import Carregando from "../../../../components/Carregando/Carregando";

const formatarPreco = (valor) =>
  `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;

const formatarData = (data) =>
  data ? new Date(data).toLocaleDateString("pt-BR") : "";

export default function ResumoCompra() {
  const { id } = useParams();
  const { pedido, buscarPedido, carregando, erro } = useCompra();

  useEffect(() => {
    buscarPedido(id);
  }, [id, buscarPedido]);

  if (carregando && !pedido) {
    return <Carregando mensagem="Carregando pedido..." />;
  }

  if (!pedido) {
    return (
      <main className={base.container}>
        <section className={base.vazio}>
          <p>{erro || "Pedido não encontrado."}</p>
          <Link to="/loja" className={base.voltar}>
            <FiArrowLeft /> Voltar para a Loja
          </Link>
        </section>
      </main>
    );
  }

  const itens = pedido.itensVenda || [];
  const totalItens = itens.reduce((acc, item) => acc + Number(item.subtotal), 0);
  const frete = Number(pedido.total) - totalItens;
  const temDigital = itens.some((item) => !item.fisico);
  const pago = pedido.status_pagamento === "pago";
  const endereco = pedido.endereco_entrega;

  return (
    <main>
      <div className={base.topo}>
        <h1 className={base.titulo}>Pedido #{pedido.id}</h1>
        <p>Feito em {formatarData(pedido.data)}</p>
      </div>

      <div className={base.container}>
        <div className={base.conteudo}>
          <div className={base.colunaPrincipal}>
            {pago && (
              <section className={`${base.cartao} ${styles.sucesso}`}>
                <FiCheckCircle className={styles.icone} />
                <div>
                  <strong>Pagamento confirmado!</strong>
                  {temDigital && (
                    <p>Seu e-book foi enviado para o e-mail da sua conta.</p>
                  )}
                </div>
              </section>
            )}

            <section className={base.cartao}>
              <h2>Itens</h2>
              <ul className={base.itens}>
                {itens.map((item) => (
                  <li key={item.id} className={base.item}>
                    <div>
                      <strong>{item.livros?.titulo || "Livro"}</strong>
                      <small>
                        {item.fisico ? "Físico" : "Digital"} · {item.qtd}x{" "}
                        {formatarPreco(item.preco_unitario)}
                      </small>
                    </div>
                    <span>{formatarPreco(item.subtotal)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {endereco && (
              <section className={base.cartao}>
                <h2>Entrega</h2>
                <p className={base.aviso}>
                  {endereco.rua}, {endereco.num}
                  {endereco.complemento ? ` - ${endereco.complemento}` : ""}
                  <br />
                  {endereco.bairro} · {endereco.cidade}/{endereco.estado} · CEP{" "}
                  {endereco.cep}
                </p>
                <p className={styles.status}>
                  Status da entrega: <strong>{pedido.status_entrega}</strong>
                </p>
              </section>
            )}
          </div>

          <aside className={base.resumo}>
            <h2>Resumo</h2>
            <div className={base.linha}>
              <span>Livros</span>
              <strong>{formatarPreco(totalItens)}</strong>
            </div>
            <div className={base.linha}>
              <span>Frete</span>
              <strong>{frete > 0 ? formatarPreco(frete) : "Grátis"}</strong>
            </div>
            <div className={`${base.linha} ${base.total}`}>
              <span>Total</span>
              <strong>{formatarPreco(pedido.total)}</strong>
            </div>

            <p className={styles.status}>
              Pagamento: <strong>{pago ? "Pago" : "Pendente"}</strong>
            </p>

            <Link to="/loja" className={base.voltar}>
              <FiArrowLeft /> Continuar comprando
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
